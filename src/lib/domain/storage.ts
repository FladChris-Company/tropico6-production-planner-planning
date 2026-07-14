import { DEFAULT_SETTINGS } from './data';
import type { Database, Entry, Project, Scenario, Settings } from './types';

export const STORAGE_KEY='tropico6-production-planner-svelte-v1';
export const LEGACY_STORAGE_KEY='tropico6-production-planner-beta1';
export const uid=(prefix:string)=>`${prefix}-${globalThis.crypto?.randomUUID?.()??Math.random().toString(36).slice(2)}`;

export function newEntry(buildingId='plantation-sugar',clusterId='cluster-main',status:Entry['status']='existing'):Entry {return {id:uid('entry'),clusterId,buildingId,modeId:'standard',count:1,efficiency:100,staffing:100,distance:'',status,note:'',rateOverrides:{inputs:{},outputs:{}},upgradeIds:[]};}
export function newScenario(name='Ist-Stand',type:Scenario['type']='current'):Scenario {return {id:uid('scenario'),name,type,clusters:[{id:'cluster-main',name:'Hauptcluster',distance:''}],entries:[],policies:{}};}
export function newProject(name='Meine Insel'):Project {const current=newScenario();return {id:uid('project'),name,era:'colonial',dlcs:['base'],currentId:current.id,selectedId:current.id,scenarios:[current]};}
export function seed():Database {const project=newProject('Beispielinsel');project.dlcs=['base'];project.scenarios[0].entries=[newEntry('plantation-sugar','cluster-main'),newEntry('plantation-sugar','cluster-main'),newEntry('rum-distillery','cluster-main'),newEntry('teamster-office','cluster-main')];project.scenarios[0].entries[2].modeId='dunder';return {schema:2,projects:[project],activeProjectId:project.id,settings:{...DEFAULT_SETTINGS},updatedAt:new Date().toISOString()};}
export function save(db:Database){db.updatedAt=new Date().toISOString();localStorage.setItem(STORAGE_KEY,JSON.stringify(db));}
export function cloneScenario(source:Scenario,name:string):Scenario {const copy=structuredClone(source);copy.id=uid('scenario');copy.name=name;copy.type='forecast';const map=new Map<string,string>();copy.clusters=copy.clusters.map(c=>{const id=uid('cluster');map.set(c.id,id);return {...c,id};});copy.entries=copy.entries.map(e=>({...e,id:uid('entry'),clusterId:map.get(e.clusterId)??copy.clusters[0].id,status:e.status==='existing'?'existing':'planned'}));return copy;}

export function serializeProjectBackup(project: Project, exportedAt = new Date()): string {
  return JSON.stringify({
    format: 'tropico6-production-planner-project',
    schemaVersion: 1,
    databaseSchema: 2,
    exportedAt: exportedAt.toISOString(),
    project
  }, null, 2);
}

type ProjectBackup = {
  format: 'tropico6-production-planner-project';
  schemaVersion: 1;
  databaseSchema: 2;
  exportedAt: string;
  project: Project;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function isValidProject(value: unknown): value is Project {
  if (!isRecord(value)) return false;
  if (typeof value.id !== 'string' || typeof value.name !== 'string') return false;
  if (!['colonial', 'world-wars', 'cold-war', 'modern'].includes(String(value.era))) return false;
  if (!Array.isArray(value.dlcs) || !value.dlcs.every((item) => typeof item === 'string')) return false;
  if (typeof value.currentId !== 'string' || typeof value.selectedId !== 'string' || !Array.isArray(value.scenarios) || value.scenarios.length === 0) return false;

  const scenariosValid = value.scenarios.every((scenario) => {
    if (!isRecord(scenario) || typeof scenario.id !== 'string' || typeof scenario.name !== 'string') return false;
    if (scenario.type !== 'current' && scenario.type !== 'forecast') return false;
    if (!Array.isArray(scenario.clusters) || scenario.clusters.length === 0 || !Array.isArray(scenario.entries) || !isRecord(scenario.policies)) return false;
    const clusterIds = new Set<string>();
    for (const cluster of scenario.clusters) {
      if (!isRecord(cluster) || typeof cluster.id !== 'string' || typeof cluster.name !== 'string') return false;
      if (cluster.distance !== '' && typeof cluster.distance !== 'number') return false;
      clusterIds.add(cluster.id);
    }
    return scenario.entries.every((entry) => {
      if (!isRecord(entry)) return false;
      if (typeof entry.id !== 'string' || typeof entry.clusterId !== 'string' || !clusterIds.has(entry.clusterId)) return false;
      if (typeof entry.buildingId !== 'string' || typeof entry.modeId !== 'string' || typeof entry.note !== 'string') return false;
      if (!['existing', 'planned', 'disabled'].includes(String(entry.status))) return false;
      if (typeof entry.count !== 'number' || !Number.isFinite(entry.count) || entry.count < 0) return false;
      if (typeof entry.efficiency !== 'number' || !Number.isFinite(entry.efficiency) || entry.efficiency < 0) return false;
      if (typeof entry.staffing !== 'number' || !Number.isFinite(entry.staffing) || entry.staffing < 0 || entry.staffing > 100) return false;
      if (entry.distance !== '' && (typeof entry.distance !== 'number' || !Number.isFinite(entry.distance))) return false;
      if (entry.upgradeIds !== undefined && (!Array.isArray(entry.upgradeIds) || !entry.upgradeIds.every((item) => typeof item === 'string'))) return false;
      return isRecord(entry.rateOverrides) && isRecord(entry.rateOverrides.inputs) && isRecord(entry.rateOverrides.outputs);
    });
  });

  const scenarioIds = new Set(value.scenarios.filter(isRecord).map((scenario) => scenario.id));
  return scenariosValid && scenarioIds.has(value.currentId) && scenarioIds.has(value.selectedId);
}

export type StorageIssue = {
  kind: 'corrupt' | 'unsupported';
  message: string;
  raw: string;
  sourceKey: string;
};

export type LoadResult =
  | { state: 'empty' | 'loaded' | 'migrated'; database: Database; issue: null }
  | { state: 'recovery'; database: null; issue: StorageIssue };

const LEGACY_BUILDING_IDS: Record<string, string> = {
  banana: 'plantation-banana', cocoa: 'plantation-cocoa', coffee: 'plantation-coffee', corn: 'plantation-corn',
  cotton: 'plantation-cotton', pineapple: 'plantation-pineapple', rubber: 'plantation-rubber', sugar: 'plantation-sugar',
  tobacco: 'plantation-tobacco', coconut: 'coconut-harvester', fish: 'fishermen-wharf', shellfish: 'fishermen-wharf',
  logging: 'logging-camp', 'coal-mine': 'mine-coal', 'gold-mine': 'mine-gold', 'iron-mine': 'mine-iron',
  pearls: 'pearl-divers', beekeeper: 'beekeeper', cattle: 'ranch-cattle', sheep: 'ranch-sheep', pig: 'ranch-pig',
  'llama-ranch': 'ranch-llama', goat: 'ranch-goat', lumber: 'lumber-mill', rum: 'rum-distillery', tannery: 'tannery',
  charcoal: 'charcoal-burner', paper: 'paper-mill', printing: 'printing-house', toys: 'toy-workshop',
  fireworks: 'fireworks-factory', teamster: 'teamster-office'
};

const LEGACY_DLC_IDS: Record<string, string> = {
  base: 'base', llama: 'llama', festival: 'festival', shores: 'tropican-shores', nature: 'return-to-nature'
};

const LEGACY_MODE_IDS: Record<string, string> = {
  'shellfish:standard': 'forefathers',
  'charcoal:normal': 'standard', 'charcoal:hasty': 'standard',
  'paper:cotton': 'cotton-wool', 'paper:wool': 'cotton-wool',
  'printing:paper': 'standard', 'printing:leather': 'standard',
  'toys:logs': 'wooden', 'toys:cotton': 'cuddly'
};

function normalizedSettings(value: unknown): Settings {
  const source = isRecord(value) ? value : {};
  const numberSetting = (key: keyof Settings) => typeof source[key] === 'number' && Number.isFinite(source[key]) ? source[key] as number : DEFAULT_SETTINGS[key] as number;
  return {
    tooltips: typeof source.tooltips === 'boolean' ? source.tooltips : DEFAULT_SETTINGS.tooltips,
    compact: typeof source.compact === 'boolean' ? source.compact : DEFAULT_SETTINGS.compact,
    profile: ['optimistic', 'realistic', 'difficult', 'custom'].includes(String(source.profile)) ? source.profile as Settings['profile'] : DEFAULT_SETTINGS.profile,
    worktimeFactor: numberSetting('worktimeFactor'),
    logisticsFactor: numberSetting('logisticsFactor'),
    transportTripsPerWorker: numberSetting('transportTripsPerWorker')
  };
}

function normalizeSchemaTwo(value: unknown): { database: Database; migrated: boolean } | null {
  if (!isRecord(value) || value.schema !== 2 || !Array.isArray(value.projects) || value.projects.length === 0) return null;
  let migrated = false;
  const projects = value.projects.map((project) => {
    if (!isRecord(project)) return project;
    const era = ['colonial', 'world-wars', 'cold-war', 'modern'].includes(String(project.era)) ? project.era : 'colonial';
    if (era !== project.era) migrated = true;
    const scenarios = Array.isArray(project.scenarios) ? project.scenarios.map((scenario) => {
      if (!isRecord(scenario)) return scenario;
      const policies = isRecord(scenario.policies) ? scenario.policies : {};
      if (policies !== scenario.policies) migrated = true;
      const entries = Array.isArray(scenario.entries) ? scenario.entries.map((entry) => {
        if (!isRecord(entry)) return entry;
        const normalized = {
          ...entry,
          note: typeof entry.note === 'string' ? entry.note : '',
          rateOverrides: isRecord(entry.rateOverrides) ? entry.rateOverrides : { inputs: {}, outputs: {} },
          upgradeIds: Array.isArray(entry.upgradeIds) ? entry.upgradeIds : []
        };
        if (normalized.note !== entry.note || normalized.rateOverrides !== entry.rateOverrides || normalized.upgradeIds !== entry.upgradeIds) migrated = true;
        return normalized;
      }) : scenario.entries;
      return { ...scenario, policies, entries };
    }) : project.scenarios;
    return { ...project, era, scenarios };
  });
  const settings = normalizedSettings(value.settings);
  if (JSON.stringify(settings) !== JSON.stringify(value.settings)) migrated = true;
  const projectIds = new Set(projects.filter(isRecord).map((project) => project.id));
  const activeProjectId = typeof value.activeProjectId === 'string' && projectIds.has(value.activeProjectId) ? value.activeProjectId : String(projects.filter(isRecord)[0]?.id ?? '');
  if (activeProjectId !== value.activeProjectId) migrated = true;
  const updatedAt = typeof value.updatedAt === 'string' ? value.updatedAt : new Date().toISOString();
  if (updatedAt !== value.updatedAt) migrated = true;
  const database = { schema: 2, projects, activeProjectId, settings, updatedAt } as Database;
  return database.projects.every(isValidProject) ? { database, migrated } : null;
}

function migrateLegacyDatabase(value: unknown): Database | null {
  if (!isRecord(value) || value.schema !== 1 || !Array.isArray(value.projects) || value.projects.length === 0) return null;
  const projects: Project[] = [];
  for (const oldProject of value.projects) {
    if (!isRecord(oldProject) || typeof oldProject.id !== 'string' || typeof oldProject.name !== 'string' || !Array.isArray(oldProject.scenarios)) return null;
    const scenarios: Scenario[] = [];
    for (const oldScenario of oldProject.scenarios) {
      if (!isRecord(oldScenario) || typeof oldScenario.id !== 'string' || typeof oldScenario.name !== 'string' || !Array.isArray(oldScenario.clusters) || !Array.isArray(oldScenario.entries)) return null;
      const clusters = oldScenario.clusters.map((cluster) => isRecord(cluster) ? { id: String(cluster.id), name: String(cluster.name), distance: cluster.distance === '' ? '' : Number(cluster.distance) } : null);
      if (clusters.some((cluster) => !cluster || !cluster.id || !cluster.name || (cluster.distance !== '' && !Number.isFinite(cluster.distance)))) return null;
      const clusterIds = new Set(clusters.map((cluster) => cluster!.id));
      const entries: Entry[] = [];
      for (const oldEntry of oldScenario.entries) {
        if (!isRecord(oldEntry) || typeof oldEntry.id !== 'string' || typeof oldEntry.cluster !== 'string' || !clusterIds.has(oldEntry.cluster) || typeof oldEntry.building !== 'string') return null;
        const buildingId = LEGACY_BUILDING_IDS[oldEntry.building];
        if (!buildingId) return null;
        const legacyMode = typeof oldEntry.mode === 'string' ? oldEntry.mode : 'standard';
        entries.push({
          id: oldEntry.id,
          clusterId: oldEntry.cluster,
          buildingId,
          modeId: LEGACY_MODE_IDS[`${oldEntry.building}:${legacyMode}`] ?? legacyMode,
          count: Number(oldEntry.count),
          efficiency: Number(oldEntry.eff),
          staffing: Number(oldEntry.staff),
          distance: oldEntry.distance === '' ? '' : Number(oldEntry.distance),
          status: ['existing', 'planned', 'disabled'].includes(String(oldEntry.status)) ? oldEntry.status as Entry['status'] : 'existing',
          note: '',
          rateOverrides: { inputs: {}, outputs: {} },
          upgradeIds: []
        });
      }
      scenarios.push({
        id: oldScenario.id,
        name: oldScenario.name,
        type: oldScenario.kind === 'forecast' ? 'forecast' : 'current',
        clusters: clusters as Scenario['clusters'],
        entries,
        policies: {}
      });
    }
    projects.push({
      id: oldProject.id,
      name: oldProject.name,
      era: 'colonial',
      dlcs: Array.isArray(oldProject.dlcs) ? [...new Set(oldProject.dlcs.map((id) => LEGACY_DLC_IDS[String(id)]).filter(Boolean))] : ['base'],
      currentId: String(oldProject.currentId),
      selectedId: String(oldProject.selectedId),
      scenarios
    });
  }
  const database: Database = {
    schema: 2,
    projects,
    activeProjectId: typeof value.active === 'string' ? value.active : projects[0].id,
    settings: { ...DEFAULT_SETTINGS },
    updatedAt: typeof value.updated === 'string' ? value.updated : new Date().toISOString()
  };
  return projects.every(isValidProject) && projects.some((project) => project.id === database.activeProjectId) ? database : null;
}

const recovery = (kind: StorageIssue['kind'], raw: string, sourceKey: string): LoadResult => ({
  state: 'recovery',
  database: null,
  issue: {
    kind,
    raw,
    sourceKey,
    message: kind === 'unsupported'
      ? 'Diese lokalen Inseldaten stammen aus einer neueren, noch nicht unterstützten Version.'
      : 'Die lokalen Inseldaten sind beschädigt oder unvollständig.'
  }
});

export function load(storage: Storage = localStorage): LoadResult {
  const currentRaw = storage.getItem(STORAGE_KEY);
  const sourceKey = currentRaw == null ? LEGACY_STORAGE_KEY : STORAGE_KEY;
  const raw = currentRaw ?? storage.getItem(LEGACY_STORAGE_KEY);
  if (raw == null) return { state: 'empty', database: seed(), issue: null };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return recovery('corrupt', raw, sourceKey);
  }

  if (!isRecord(parsed) || (parsed.schema !== 1 && parsed.schema !== 2)) return recovery('unsupported', raw, sourceKey);
  if (parsed.schema === 1) {
    const database = migrateLegacyDatabase(parsed);
    if (!database) return recovery('corrupt', raw, sourceKey);
    storage.setItem(STORAGE_KEY, JSON.stringify(database));
    return { state: 'migrated', database, issue: null };
  }

  const normalized = normalizeSchemaTwo(parsed);
  if (!normalized) return recovery('corrupt', raw, sourceKey);
  if (normalized.migrated) storage.setItem(STORAGE_KEY, JSON.stringify(normalized.database));
  return { state: normalized.migrated ? 'migrated' : 'loaded', database: normalized.database, issue: null };
}

function parseProjectBackup(content: string): ProjectBackup {
  let value: unknown;
  try {
    value = JSON.parse(content);
  } catch {
    throw new Error('Die gewählte Datei ist keine gültige JSON-Datei.');
  }
  if (!isRecord(value) || value.format !== 'tropico6-production-planner-project') {
    throw new Error('Diese Sicherung stammt nicht vom Tropico-6-Produktionsplaner.');
  }
  if (value.schemaVersion !== 1 || value.databaseSchema !== 2) {
    throw new Error('Diese Schemaversion wird nicht unterstützt.');
  }
  if (typeof value.exportedAt !== 'string' || !isValidProject(value.project)) {
    throw new Error('Die Sicherung enthält keine vollständigen Inseldaten.');
  }
  return value as ProjectBackup;
}

export function importProjectBackup(
  content: string,
  database: Database,
  knownBuildings: ReadonlyMap<string, string>,
  importedProjectId = uid('project')
): Database {
  const backup = parseProjectBackup(content);
  const project = structuredClone(backup.project);
  const requiredDlcs = new Set(project.dlcs);
  for (const scenario of project.scenarios) {
    for (const entry of scenario.entries) {
      const dlc = knownBuildings.get(entry.buildingId);
      if (!dlc) throw new Error(`Unbekanntes Gebäude in der Sicherung: ${entry.buildingId}`);
      requiredDlcs.add(dlc);
    }
  }
  const usedProjectIds = new Set(database.projects.map((item) => item.id));
  let uniqueProjectId = importedProjectId;
  let suffix = 2;
  while (usedProjectIds.has(uniqueProjectId)) {
    uniqueProjectId = `${importedProjectId}-import${suffix === 2 ? '' : `-${suffix}`}`;
    suffix += 1;
  }
  project.id = uniqueProjectId;
  const usedProjectNames = new Set(database.projects.map((item) => item.name));
  if (usedProjectNames.has(project.name)) {
    const originalName = project.name;
    let suffix = 1;
    do {
      project.name = `${originalName} (Import${suffix === 1 ? '' : ` ${suffix}`})`;
      suffix += 1;
    } while (usedProjectNames.has(project.name));
  }
  project.dlcs = [...requiredDlcs];
  return {
    ...database,
    projects: [...database.projects, project],
    activeProjectId: project.id
  };
}
