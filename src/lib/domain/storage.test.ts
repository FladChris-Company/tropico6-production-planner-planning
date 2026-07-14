import { describe, expect, it } from 'vitest';
import { LEGACY_STORAGE_KEY, STORAGE_KEY, importProjectBackup, load, seed, serializeProjectBackup } from './storage';

const memoryStorage = (initial: Record<string, string> = {}) => {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
    key: (index: number) => [...values.keys()][index] ?? null,
    get length() { return values.size; }
  } satisfies Storage;
};

describe('local island storage', () => {
  it('migrates the legacy beta island without losing its building settings', () => {
    const legacy = {
      schema: 1,
      projects: [{
        id: 'project-old', name: 'Alte Ruminsel', dlcs: ['base', 'nature'], currentId: 'scenario-old', selectedId: 'scenario-old',
        scenarios: [{
          id: 'scenario-old', name: 'Ist-Stand', kind: 'current', clusters: [{ id: 'cluster-old', name: 'Hauptcluster', distance: '' }],
          entries: [{ id: 'entry-rum', cluster: 'cluster-old', building: 'rum', mode: 'dunder', count: 2, eff: 90, staff: 75, distance: 3, status: 'existing' }]
        }]
      }],
      active: 'project-old',
      updated: '2026-07-01T10:00:00.000Z'
    };
    const storage = memoryStorage({ [LEGACY_STORAGE_KEY]: JSON.stringify(legacy) });

    const result = load(storage);

    expect(result.state).toBe('migrated');
    expect(result.database?.projects[0]).toMatchObject({ name: 'Alte Ruminsel', era: 'colonial', dlcs: ['base', 'return-to-nature'] });
    expect(result.database?.projects[0].scenarios[0].entries[0]).toMatchObject({
      buildingId: 'rum-distillery', modeId: 'dunder', count: 2, efficiency: 90, staffing: 75, distance: 3
    });
    expect(JSON.parse(storage.getItem(STORAGE_KEY) ?? '{}').schema).toBe(2);
    expect(storage.getItem(LEGACY_STORAGE_KEY)).toBe(JSON.stringify(legacy));
  });

  it('does not silently replace malformed local data with the example island', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: '{broken' });

    const result = load(storage);

    expect(result).toMatchObject({ state: 'recovery', database: null, issue: { kind: 'corrupt', raw: '{broken' } });
    expect(storage.getItem(STORAGE_KEY)).toBe('{broken');
  });

  it('keeps an unsupported future schema untouched for recovery', () => {
    const raw = JSON.stringify({ schema: 99, projects: [] });
    const storage = memoryStorage({ [STORAGE_KEY]: raw });

    const result = load(storage);

    expect(result).toMatchObject({ state: 'recovery', database: null, issue: { kind: 'unsupported', raw } });
    expect(storage.getItem(STORAGE_KEY)).toBe(raw);
  });

  it('normalizes older schema-2 data with missing defaults', () => {
    const database = seed();
    const oldProject = structuredClone(database.projects[0]) as Partial<typeof database.projects[0]>;
    delete oldProject.era;
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify({ ...database, projects: [oldProject], settings: {} }) });

    const result = load(storage);

    expect(result.state).toBe('migrated');
    expect(result.database?.projects[0].era).toBe('colonial');
    expect(result.database?.settings.profile).toBe('realistic');
  });
});

describe('project backup', () => {
  it('exports the current island with format and version metadata', () => {
    const database = seed();
    const content = serializeProjectBackup(
      database.projects[0],
      new Date('2026-07-14T12:00:00.000Z')
    );
    const backup = JSON.parse(content);

    expect(backup).toMatchObject({
      format: 'tropico6-production-planner-project',
      schemaVersion: 1,
      databaseSchema: 2,
      exportedAt: '2026-07-14T12:00:00.000Z',
      project: { name: 'Beispielinsel', era: 'colonial' }
    });
  });

  it('imports a valid island as a separate active project', () => {
    const database = seed();
    const exportedProject = structuredClone(database.projects[0]);
    exportedProject.name = 'Ruminsel';
    const content = serializeProjectBackup(exportedProject);
    const knownBuildings = new Map(exportedProject.scenarios.flatMap((scenario) => scenario.entries.map((entry) => [entry.buildingId, 'base'])));

    const imported = importProjectBackup(content, database, knownBuildings, 'project-imported');

    expect(imported.projects).toHaveLength(2);
    expect(imported.activeProjectId).toBe('project-imported');
    expect(imported.projects[1]).toMatchObject({ id: 'project-imported', name: 'Ruminsel', era: 'colonial' });
    expect(database.projects).toHaveLength(1);
  });

  it.each([
    ['ungültiges JSON', '{', 'keine gültige JSON-Datei'],
    ['falsches Format', JSON.stringify({ format: 'other', schemaVersion: 1, databaseSchema: 2, project: {} }), 'nicht vom Tropico-6-Produktionsplaner'],
    ['falsche Schemaversion', JSON.stringify({ format: 'tropico6-production-planner-project', schemaVersion: 99, databaseSchema: 2, project: {} }), 'Schemaversion wird nicht unterstützt']
  ])('rejects %s without changing the island database', (_case, content, message) => {
    const database = seed();

    expect(() => importProjectBackup(content, database, new Map())).toThrow(message);
    expect(database.projects).toHaveLength(1);
  });

  it('rejects unknown buildings instead of importing broken island data', () => {
    const database = seed();
    const project = structuredClone(database.projects[0]);
    project.scenarios[0].entries[0].buildingId = 'unknown-building';
    const content = serializeProjectBackup(project);

    expect(() => importProjectBackup(content, database, new Map())).toThrow('Unbekanntes Gebäude');
    expect(database.projects).toHaveLength(1);
  });

  it('rejects negative building counts as incomplete island data', () => {
    const database = seed();
    const project = structuredClone(database.projects[0]);
    project.scenarios[0].entries[0].count = -1;
    const content = serializeProjectBackup(project);
    const knownBuildings = new Map(project.scenarios.flatMap((scenario) => scenario.entries.map((entry) => [entry.buildingId, 'base'])));

    expect(() => importProjectBackup(content, database, knownBuildings)).toThrow('keine vollständigen Inseldaten');
  });

  it('rejects malformed improvement selections as incomplete island data', () => {
    const database = seed();
    const project = structuredClone(database.projects[0]);
    project.scenarios[0].entries[0].upgradeIds = 'taas' as unknown as string[];
    const content = serializeProjectBackup(project);
    const knownBuildings = new Map(project.scenarios.flatMap((scenario) => scenario.entries.map((entry) => [entry.buildingId, 'base'])));

    expect(() => importProjectBackup(content, database, knownBuildings)).toThrow('keine vollständigen Inseldaten');
  });

  it('avoids duplicate project ids when an island is imported more than once', () => {
    const database = seed();
    const project = database.projects[0];
    const content = serializeProjectBackup(project);
    const knownBuildings = new Map(project.scenarios.flatMap((scenario) => scenario.entries.map((entry) => [entry.buildingId, 'base'])));

    const imported = importProjectBackup(content, database, knownBuildings, project.id);

    expect(new Set(imported.projects.map((item) => item.id)).size).toBe(2);
    expect(imported.activeProjectId).not.toBe(project.id);
    expect(imported.projects[1].name).toBe('Beispielinsel (Import)');
  });
});
