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

const upgradesCsv = `building_id;building_name_de;building_name_en;upgrade_id;upgrade_name_de;upgrade_name_en;upgrade_cost_usd;era_required;effect_type;effect_value;effect_unit;effect_description;data_status;is_placeholder;source_url
toy_workshop;Spielzeugfabrik;Toy Workshop;taas;TAAS – Toys As A Service;TAAS – Toys As A Service;;;Effizienz;15;Prozent;+15 % Gebäudeeffizienz;verified_wiki_individual_page;Nein;https://example.test/toys`;

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

  it('übernimmt dokumentierte Verbesserungen kolonialer Gebäude', async () => {
    const { generateColonialData } = await loadGenerator();
    const buildingsWithToyWorkshop = `${buildingsCsv}\ntoy_workshop;Spielzeugfabrik;Toy Workshop;Kolonialzeit;Industrie;The Llama of Wall Street;Ja;Nein;4;Ungebildet;verified_wiki_table;https://example.test/toys`;
    const result = generateColonialData({ buildingsCsv: buildingsWithToyWorkshop, recipesCsv, goodsCsv, modesCsv, sourcesCsv, upgradesCsv });

    expect(result.buildings.find((building) => building.id === 'toy-workshop').upgrades).toEqual([
      expect.objectContaining({ id: 'taas', name: 'TAAS – Toys As A Service', effectType: 'efficiency', effectValue: 15, effectUnit: 'percent' })
    ]);
  });

  it('übernimmt eine Community-Schätzung als berechenbaren Schätzwert', async () => {
    const { generateColonialData } = await loadGenerator();
    const estimatedBuildings = `${buildingsCsv}\nfishermens_wharf;Fischereihafen;Fishermen's Wharf;Kolonialzeit;Nahrung und Rohstoffe;Grundspiel;Ja;Nein;5;Ungebildet;verified_wiki_table;https://example.test/wharf`;
    const estimatedRecipes = `${recipesCsv}\nfishermens_wharf_forefathers;fishermens_wharf;Grundmodus;5;;;;;Fish;3.5;je Arbeiter und Arbeitstag bei 100 % Effizienz;estimated_community;https://example.test/estimate;Stark abhängig von der Fahrstrecke zum Fischvorkommen.`;
    const estimatedGoods = `${goodsCsv}\nfish;Fisch;Fish;Rohstoff;name_from_production_dataset;https://example.test/goods`;
    const estimatedModes = `${modesCsv}\nfishermens_wharf_forefathers;fishermens_wharf;Grundmodus;Kolonialzeit;estimated_community;https://example.test/estimate`;
    const recipesWithNotesHeader = estimatedRecipes.replace('measurement_basis;data_status;source_url', 'measurement_basis;data_status;source_url;notes');
    const result = generateColonialData({ buildingsCsv: estimatedBuildings, recipesCsv: recipesWithNotesHeader, goodsCsv: estimatedGoods, modesCsv: estimatedModes, sourcesCsv });

    expect(result.buildings.find((building) => building.id === 'fishermen-wharf')).toEqual(expect.objectContaining({
      dataStatus: 'estimated',
      dataNote: 'Stark abhängig von der Fahrstrecke zum Fischvorkommen.',
      modes: [expect.objectContaining({ outputs: { fish: 3500 } })]
    }));
  });

  it('verarbeitet die vollständige manuelle Wissensquelle ohne Validierungsfehler', async () => {
    const { generateColonialData } = await loadGenerator();
    const [realBuildings, realRecipes, realGoods, realModes, realSources, realUpgrades] = await Promise.all([
      readFile(new URL('../manual/gebaeude.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/produktionsrezepte.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/waren.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/arbeitsmodi.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/quellen.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/verbesserungen.csv', import.meta.url), 'utf8')
    ]);
    const result = generateColonialData({ buildingsCsv: realBuildings, recipesCsv: realRecipes, goodsCsv: realGoods, modesCsv: realModes, sourcesCsv: realSources, upgradesCsv: realUpgrades });

    expect(result.validation.errors).toEqual([]);
    expect(result.source.colonialBuildingRows).toBe(54);
    expect(result.source.colonialRecipeRows).toBe(46);
    expect(result.source.colonialModeRows).toBe(46);
    expect(result.source.colonialUpgradeRows).toBe(3);
    expect(result.sources).toHaveLength(10);
  });

  it('liefert koloniale Produktionswege und bewahrt Testchargen ohne falsche Zeitrate', async () => {
    const { generateColonialData } = await loadGenerator();
    const [realBuildings, realRecipes, realGoods, realModes, realSources, realUpgrades] = await Promise.all([
      readFile(new URL('../manual/gebaeude.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/produktionsrezepte.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/waren.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/arbeitsmodi.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/quellen.csv', import.meta.url), 'utf8'),
      readFile(new URL('../manual/verbesserungen.csv', import.meta.url), 'utf8')
    ]);
    const result = generateColonialData({ buildingsCsv: realBuildings, recipesCsv: realRecipes, goodsCsv: realGoods, modesCsv: realModes, sourcesCsv: realSources, upgradesCsv: realUpgrades });

    expect(result.buildings).toHaveLength(69);
    expect(result.buildings.filter((building) => building.id.startsWith('mine-')).map((building) => building.id)).toEqual(['mine-coal', 'mine-iron', 'mine-gold']);
    expect(result.buildings.find((building) => building.id === 'fishermen-wharf')).toEqual(expect.objectContaining({
      dataStatus: 'estimated',
      modes: [expect.objectContaining({ outputs: { fish: 3500 } })]
    }));
    expect(result.sources).toContainEqual(expect.objectContaining({ id: 'reddit_colonial_economy' }));
    expect(result.buildings.find((building) => building.id === 'ranch-cattle').modes[0].outputs).toEqual({ meat: 1500, hides: 2000 });
    expect(result.buildings.find((building) => building.id === 'toy-workshop')).toEqual(expect.objectContaining({
      dataStatus: 'unknown',
      upgrades: expect.arrayContaining([
        expect.objectContaining({ id: 'taas', effectType: 'efficiency', effectValue: 15 }),
        expect.objectContaining({ id: 'snug-workspace', effectType: 'workers', effectValue: 2 }),
        expect.objectContaining({ id: 'set-a-sign', effectType: 'information' })
      ]),
      modes: [
        expect.objectContaining({ inputs: { logs: null }, outputs: { toys: null }, referenceBatch: { inputs: { logs: 1000 }, outputs: { toys: 1729 } } }),
        expect.objectContaining({ inputs: { cotton: null }, outputs: { toys: null } }),
        expect.objectContaining({ inputs: { rubber: null }, outputs: { toys: null } })
      ]
    }));
    expect(result.buildings.find((building) => building.id === 'logging-camp')).toEqual(expect.objectContaining({
      dataStatus: 'estimated',
      modes: [expect.objectContaining({ outputs: { logs: 3000 } })]
    }));
    expect(result.buildings.find((building) => building.id === 'charcoal-burner').modes[0]).toEqual(expect.objectContaining({
      inputs: { logs: null },
      outputs: { coal: null }
    }));
    expect(result.buildings.find((building) => building.id === 'fireworks-factory').modes).toHaveLength(4);
    expect(result.buildings.find((building) => building.id === 'rum-distillery').icon).toBe('🍾');
  });
});
