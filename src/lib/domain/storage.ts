import { DEFAULT_SETTINGS } from './data';
import type { Database, Entry, Project, Scenario } from './types';

export const STORAGE_KEY='tropico6-production-planner-svelte-v1';
export const uid=(prefix:string)=>`${prefix}-${globalThis.crypto?.randomUUID?.()??Math.random().toString(36).slice(2)}`;

export function newEntry(buildingId='plantation-sugar',clusterId='cluster-main',status:Entry['status']='existing'):Entry {return {id:uid('entry'),clusterId,buildingId,modeId:'standard',count:1,efficiency:100,staffing:100,distance:'',status,note:'',rateOverrides:{inputs:{},outputs:{}},upgradeIds:[]};}
export function newScenario(name='Ist-Stand',type:Scenario['type']='current'):Scenario {return {id:uid('scenario'),name,type,clusters:[{id:'cluster-main',name:'Hauptcluster',distance:''}],entries:[],policies:{}};}
export function newProject(name='Meine Insel'):Project {const current=newScenario();return {id:uid('project'),name,era:'colonial',dlcs:['base'],currentId:current.id,selectedId:current.id,scenarios:[current]};}
export function seed():Database {const project=newProject('Beispielinsel');project.dlcs=['base'];project.scenarios[0].entries=[newEntry('plantation-sugar','cluster-main'),newEntry('plantation-sugar','cluster-main'),newEntry('rum-distillery','cluster-main'),newEntry('teamster-office','cluster-main')];project.scenarios[0].entries[2].modeId='dunder';return {schema:2,projects:[project],activeProjectId:project.id,settings:{...DEFAULT_SETTINGS},updatedAt:new Date().toISOString()};}
export function load():Database {try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return seed();const parsed=JSON.parse(raw) as Database;if(parsed.schema!==2||!Array.isArray(parsed.projects))return seed();return {...parsed,projects:parsed.projects.map(project=>({...project,era:project.era??'colonial'})),settings:{...DEFAULT_SETTINGS,...parsed.settings}};}catch{return seed();}}
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
