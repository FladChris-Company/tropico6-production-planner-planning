import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

async function loadGenerator() {
  return import('./lib/colonial-data.mjs').catch(() => ({
    generateColonialData: () => ({ buildings: [], goods: [], validation: { errors: [] } })
  }));
}

const buildingsCsv = `building_id;name_de;name_en;era;category;dlc;is_buildable;is_module;jobs;education;data_status;source_url
plantation;Plantage;Plantation;Kolonialzeit;Nahrung und Rohstoffe;Grundspiel;Ja;Nein;8;Ungebildet;verified_wiki_table;https://example.test/buildings
factory;Fabrik;Factory;Weltkriege;Industrie;Grundspiel;Ja;Nein;4;Ungebildet;verified_wiki_table;https://example.test/buildings`;

const recipesCsv = `recipe_id;building_id;mode_name_de;workers;input_1_good;input_1_qty_per_worker_workday;input_2_good;input_2_qty_per_worker_workday;output_good;output_qty_per_worker_workday;measurement_basis;data_status;source_url
plantation_sugar;plantation;Zucker;8;;;;;Sugar;1.5;je Arbeiter und Arbeitstag bei 100 % Effizienz;measured_community;https://example.test/rates
plantation_rubber;plantation;Gummi;8;;;;;Rubber;1.2;je Arbeiter und Arbeitstag bei 100 % Effizienz;measured_community;https://example.test/rates`;

const goodsCsv = `good_id;name_de;name_en;type;data_status;source_url
sugar;Zucker;Sugar;Rohstoff;name_from_production_dataset;https://example.test/goods
rubber;Gummi;Rubber;Rohstoff;name_from_production_dataset;https://example.test/goods`;

const modesCsv = `mode_id;building_id;mode_name_de;era;data_status;source_url
plantation_sugar;plantation;Zucker;Kolonialzeit;measured_community;https://example.test/rates
plantation_rubber;plantation;Gummi;Weltkriege;measured_community;https://example.test/rates`;

const sourcesCsv = `source_id;title;url;used_for;source_type;reliability;retrieved_at
rates;Messwerte;https://example.test/rates;Produktionsraten;Community-Messung;mittel;2026-07-13`;

describe('Kolonialdaten-Generator', () => {
  it('erzeugt aus einer Plantagenvariante eine skalierte Laufzeitrate', async () => {
    const { generateColonialData } = await loadGenerator();
    const result = generateColonialData({ buildingsCsv, recipesCsv, goodsCsv, modesCsv, sourcesCsv });

    expect(result.buildings).toContainEqual(expect.objectContaining({
      id: 'plantation-sugar',
      name: 'Zuckerplantage',
      workers: 8,
      availableFrom: 'colonial',
      modes: [expect.objectContaining({ availableFrom: 'colonial', outputs: { sugar: 1500 } })]
    }));
    expect(result.sources).toEqual([expect.objectContaining({ id: 'rates', title: 'Messwerte' })]);
    expect(result.buildings.some((building) => building.id === 'plantation-rubber')).toBe(false);
    expect(result.validation.errors).toEqual([]);
  });

  it('serialisiert generierte Daten deterministisch als JSON-Datei', async () => {
    const { serializeColonialData = () => '' } = await loadGenerator();
    const serialized = serializeColonialData({ schema: 1, buildings: [{ id: 'plantation-sugar' }] });

    expect(serialized.endsWith('\n')).toBe(true);
    expect(JSON.parse(serialized)).toEqual({ schema: 1, buildings: [{ id: 'plantation-sugar' }] });
  });

  it('verwirft negative Produktionsmengen aus der Wissensquelle', async () => {
    const { generateColonialData } = await loadGenerator();
    const invalidRecipes = recipesCsv.replace(';1.5;', ';-1.5;');
    const result = generateColonialData({ buildingsCsv, recipesCsv: invalidRecipes, goodsCsv, modesCsv, sourcesCsv });

    expect(result.validation.errors).toContain('Negative Menge output in plantation_sugar');
  });

  it('verarbeitet die vollständige manuelle Wissensquelle ohne Validierungsfehler', async () => {
    const { generateColonialData } = await loadGenerator();
    const [realBuildings, realRecipes, realGoods, realModes, realSources] = await Promise.all([
      readFile(new URL('../manual/gebaeude.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/produktionsrezepte.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/waren.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/arbeitsmodi.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/quellen.csv', import.meta.url), 'utf8')
    ]);
    const result = generateColonialData({ buildingsCsv: realBuildings, recipesCsv: realRecipes, goodsCsv: realGoods, modesCsv: realModes, sourcesCsv: realSources });

    expect(result.validation.errors).toEqual([]);
    expect(result.source.colonialBuildingRows).toBe(54);
    expect(result.source.colonialRecipeRows).toBe(42);
    expect(result.source.colonialModeRows).toBe(42);
    expect(result.sources).toHaveLength(5);
  });

  it('liefert nur kolonial nutzbare Varianten und markiert Testchargen als unberechenbar', async () => {
    const { generateColonialData } = await loadGenerator();
    const [realBuildings, realRecipes, realGoods, realModes, realSources] = await Promise.all([
      readFile(new URL('../manual/gebaeude.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/produktionsrezepte.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/waren.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/arbeitsmodi.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/quellen.csv', import.meta.url), 'utf8')
    ]);
    const result = generateColonialData({ buildingsCsv: realBuildings, recipesCsv: realRecipes, goodsCsv: realGoods, modesCsv: realModes, sourcesCsv: realSources });

    expect(result.buildings).toHaveLength(69);
    expect(result.buildings.filter((building) => building.id.startsWith('mine-')).map((building) => building.id)).toEqual(['mine-coal', 'mine-iron', 'mine-gold']);
    expect(result.buildings.some((building) => building.id === 'fishermen-wharf')).toBe(true);
    expect(result.buildings.find((building) => building.id === 'ranch-cattle').modes[0].outputs).toEqual({ meat: 1500, hides: 2000 });
    expect(result.buildings.find((building) => building.id === 'toy-workshop')).toEqual(expect.objectContaining({
      dataStatus: 'unknown',
      modes: [expect.objectContaining({ inputs: { logs: null }, outputs: { toys: null } })]
    }));
    expect(result.buildings.find((building) => building.id === 'rum-distillery').icon).toBe('🍾');
  });
});
