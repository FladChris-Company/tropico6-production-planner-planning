import { describe, expect, it } from 'vitest';
import { importProjectBackup, seed, serializeProjectBackup } from './storage';

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
