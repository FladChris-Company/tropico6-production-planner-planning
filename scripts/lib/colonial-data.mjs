const RATE_SCALE = 1000;
const RATE_BASIS = 'je Arbeiter und Arbeitstag bei 100 % Effizienz';

const DLC_IDS = new Map([
  ['Grundspiel', 'base'],
  ['Festival', 'festival'],
  ['Going Viral', 'going-viral'],
  ['Return to Nature', 'return-to-nature'],
  ['The Llama of Wall Street', 'llama'],
  ['Tropican Shores', 'tropican-shores']
]);

const EDUCATION_IDS = new Map([
  ['Ungebildet', 'uneducated'],
  ['Oberschule', 'high-school'],
  ['Hochschule', 'college']
]);

const ERA_IDS = new Map([
  ['Kolonialzeit', 'colonial'],
  ['Weltkriege', 'world-wars'],
  ['Kalter Krieg', 'cold-war'],
  ['Moderne', 'modern']
]);

const ICONS = {
  banana: '🍌', cocoa: '🫘', coffee: '☕', corn: '🌽', cotton: '☁️', pineapple: '🍍', rubber: '🌿', sugar: '🧊', tobacco: '🍂',
  coal: '⬛', gold: '🟨', iron: '⛏️', meat: '🥩', hides: '🟫', wool: '🐑', milk: '🥛', leather: '👢', planks: '🪚', rum: '🍾', toys: '🧸'
};

const MODE_IDS = new Map([
  ['lumber_mill_normal', 'normal'],
  ['lumber_mill_hasty_debarking', 'hasty'],
  ['rum_distillery_normal', 'normal'],
  ['rum_distillery_dunder_still', 'dunder'],
  ['tannery_normal', 'normal'],
  ['tannery_chrome_tanning', 'chrome']
]);

const RUNTIME_IDS = new Map([
  ['fishermens_wharf', 'fishermen-wharf'],
  ['teamsters_office', 'teamster-office']
]);

function slug(value) {
  return String(value ?? '').trim().toLowerCase().replaceAll('_', '-');
}

export function parseSemicolonCsv(source) {
  const rows = [];
  let row = [], field = '', quoted = false;
  const text = String(source ?? '').replace(/^\uFEFF/, '');
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { field += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === ';' && !quoted) {
      row.push(field); field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(field); field = '';
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
    } else field += char;
  }
  row.push(field);
  if (row.some((value) => value !== '')) rows.push(row);
  const [headers = [], ...values] = rows;
  return values.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])));
}

function numberOrZero(value) {
  const parsed = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function recipeRates(recipe, goodIds, calculable, errors) {
  const result = { inputs: {}, outputs: {} };
  const add = (target, goodName, amount, field) => {
    if (!goodName) return;
    const goodId = goodIds.get(goodName.trim().toLowerCase());
    if (!goodId) { errors.push(`Unbekannte Ware ${goodName} in ${recipe.recipe_id}`); return; }
    const numericAmount = numberOrZero(amount);
    target[goodId] = calculable ? numericAmount * RATE_SCALE : null;
    if (calculable && !String(amount ?? '').trim()) errors.push(`Fehlende Menge ${field} in ${recipe.recipe_id}`);
    if (calculable && numericAmount < 0) errors.push(`Negative Menge ${field} in ${recipe.recipe_id}`);
  };
  add(result.inputs, recipe.input_1_good, recipe.input_1_qty_per_worker_workday, 'input_1');
  add(result.inputs, recipe.input_2_good, recipe.input_2_qty_per_worker_workday, 'input_2');
  add(result.outputs, recipe.output_good, recipe.output_qty_per_worker_workday, 'output');
  return result;
}

function referenceBatch(recipes, goodIds) {
  if (!recipes.length || !recipes.every((recipe) => recipe.data_status === 'measured_community_batch')) return undefined;
  const inputs = {}, outputs = {};
  const add = (target, goodName, amount) => {
    if (!goodName || !String(amount ?? '').trim()) return;
    const goodId = goodIds.get(goodName.trim().toLowerCase());
    if (goodId) target[goodId] = numberOrZero(amount);
  };
  for (const recipe of recipes) {
    add(inputs, recipe.input_1_good, recipe.input_1_qty_per_worker_workday);
    add(inputs, recipe.input_2_good, recipe.input_2_qty_per_worker_workday);
    add(outputs, recipe.output_good, recipe.output_qty_per_worker_workday);
  }
  return { inputs, outputs };
}

function statusFor(recipes) {
  const statuses = recipes.map((recipe) => recipe.measurement_basis === RATE_BASIS ? recipe.data_status : 'unknown');
  if (statuses.every((status) => status === 'measured_community')) return 'measured';
  if (statuses.every((status) => ['measured_community', 'estimated_community'].includes(status))) return 'estimated';
  return 'unknown';
}

function sourceFor(building, recipes) {
  const urls = [...new Set([building.source_url, ...recipes.map((recipe) => recipe.source_url)].filter(Boolean))];
  return urls.join(' · ');
}

function modeFromRecipes(id, name, recipes, goodIds, errors) {
  const calculable = recipes.every((recipe) => ['measured_community', 'estimated_community'].includes(recipe.data_status) && recipe.measurement_basis === RATE_BASIS);
  const inputs = {}, outputs = {};
  for (const recipe of recipes) {
    const rates = recipeRates(recipe, goodIds, calculable, errors);
    Object.assign(inputs, rates.inputs);
    Object.assign(outputs, rates.outputs);
  }
  const batch = referenceBatch(recipes, goodIds);
  return { id, name, availableFrom: ERA_IDS.get(recipes[0]?.mode_era) ?? 'colonial', inputs, outputs, ...(batch ? { referenceBatch: batch } : {}) };
}

function genericVariants(building, recipes, goodsById, goodIds, errors) {
  const groups = new Map();
  for (const recipe of recipes) {
    let key = recipe.recipe_id;
    if (building.building_id === 'ranch') key = recipe.recipe_id.match(/^ranch_(cattle|sheep)_/)?.[1] ?? recipe.recipe_id.replace(/^ranch_/, '');
    else key = recipe.recipe_id.replace(new RegExp(`^${building.building_id}_`), '');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(recipe);
  }
  return [...groups.entries()].map(([variant, variantRecipes]) => {
    const outputName = variantRecipes[0].output_good?.trim().toLowerCase();
    const outputId = goodIds.get(outputName);
    const good = goodsById.get(outputId);
    const names = building.building_id === 'plantation'
      ? { rubber: 'Kautschukplantage', default: `${good?.name ?? variantRecipes[0].mode_name_de}plantage` }
      : building.building_id === 'mine'
        ? { default: `${good?.name ?? variantRecipes[0].mode_name_de}mine` }
        : { cattle: 'Rinderfarm', sheep: 'Schaffarm', crocodile: 'Krokodilfarm', pig: 'Schweinefarm', llama: 'Lamafarm', goat: 'Ziegenfarm', default: variantRecipes[0].mode_name_de };
    const name = names[variant] ?? names[outputId] ?? names.default;
    const runtimeId = `${slug(building.building_id)}-${slug(variant)}`;
    return createBuilding(building, variantRecipes, goodIds, errors, {
      id: runtimeId,
      name,
      icon: ICONS[outputId] ?? '•',
      modes: [modeFromRecipes('standard', 'Standard', variantRecipes, goodIds, errors)]
    });
  });
}

function createBuilding(building, recipes, goodIds, errors, overrides = {}) {
  const production = recipes.length > 0;
  const teamster = building.building_id === 'teamsters_office';
  const modes = overrides.modes ?? (production
    ? recipes.map((recipe) => modeFromRecipes(MODE_IDS.get(recipe.recipe_id) ?? (slug(recipe.recipe_id.replace(`${building.building_id}_`, '')) || 'standard'), recipe.mode_name_de || 'Standard', [recipe], goodIds, errors))
    : [{ id: 'standard', name: 'Standard', inputs: {}, outputs: {} }]);
  const stage = building.building_id === 'printing_house' ? 2 : modes.some((mode) => Object.keys(mode.inputs).length > 0) ? 1 : production ? 0 : 99;
  const primaryOutput = Object.keys(modes[0]?.outputs ?? {})[0];
  const dataNote = [...new Set(recipes.map((recipe) => recipe.notes).filter(Boolean))].join(' ');
  return {
    id: overrides.id ?? RUNTIME_IDS.get(building.building_id) ?? slug(building.building_id),
    name: overrides.name ?? building.name_de,
    icon: overrides.icon ?? ICONS[primaryOutput] ?? (teamster ? '🐎' : '•'),
    category: building.category,
    dlc: DLC_IDS.get(building.dlc) ?? slug(building.dlc),
    workers: numberOrZero(building.jobs),
    education: EDUCATION_IDS.get(building.education) ?? 'uneducated',
    kind: teamster ? 'teamster' : production ? 'production' : 'infrastructure',
    stage: teamster ? 99 : stage,
    dataStatus: production ? statusFor(recipes) : 'verified',
    ...(dataNote ? { dataNote } : {}),
    source: sourceFor(building, recipes),
    availableFrom: 'colonial',
    upgrades: building.upgrades ?? [],
    modes
  };
}

export function generateColonialData({ buildingsCsv, recipesCsv, goodsCsv, modesCsv = '', sourcesCsv = '', upgradesCsv = '' }) {
  const allBuildings = parseSemicolonCsv(buildingsCsv);
  const allRecipes = parseSemicolonCsv(recipesCsv);
  const allGoods = parseSemicolonCsv(goodsCsv);
  const allModes = parseSemicolonCsv(modesCsv);
  const allSources = parseSemicolonCsv(sourcesCsv);
  const allUpgrades = parseSemicolonCsv(upgradesCsv);
  const errors = [];
  const colonialRows = allBuildings.filter((building) => building.era === 'Kolonialzeit');
  const colonialIds = new Set(colonialRows.map((building) => building.building_id));
  const colonialUpgrades = allUpgrades.filter((item) => colonialIds.has(item.building_id) && item.is_placeholder !== 'Ja' && (!item.era_required || item.era_required === 'Kolonialzeit'));
  const upgradesByBuilding = new Map();
  for (const upgrade of colonialUpgrades) {
    if (!upgradesByBuilding.has(upgrade.building_id)) upgradesByBuilding.set(upgrade.building_id, []);
    upgradesByBuilding.get(upgrade.building_id).push({
      id: slug(upgrade.upgrade_id),
      name: upgrade.upgrade_name_de,
      effectType: upgrade.effect_type === 'Effizienz' ? 'efficiency' : upgrade.effect_type === 'Arbeitsplätze' ? 'workers' : 'information',
      effectValue: numberOrZero(upgrade.effect_value),
      effectUnit: upgrade.effect_unit === 'Prozent' ? 'percent' : upgrade.effect_unit === 'Arbeitsplätze' ? 'workers' : slug(upgrade.effect_unit),
      description: upgrade.effect_description,
      dataStatus: upgrade.data_status?.startsWith('verified') ? 'verified' : 'unknown',
      source: upgrade.source_url
    });
  }
  const allModesById = new Map(allModes.map((mode) => [mode.mode_id, mode]));
  const colonialModes = allModes.filter((mode) => colonialIds.has(mode.building_id) && mode.era === 'Kolonialzeit');
  const modesById = new Map(colonialModes.map((mode) => [mode.mode_id, mode]));
  const recipesForColonialBuildings = allRecipes.filter((recipe) => colonialIds.has(recipe.building_id));
  for (const recipe of recipesForColonialBuildings) if (allModes.length && !allModesById.has(recipe.recipe_id)) errors.push(`Fehlender Arbeitsmodus ${recipe.recipe_id}`);
  const colonialRecipes = recipesForColonialBuildings.filter((recipe) => !allModes.length || modesById.has(recipe.recipe_id)).map((recipe) => ({...recipe,mode_era:modesById.get(recipe.recipe_id)?.era}));
  const goods = allGoods.map((good) => ({ id: good.good_id, name: good.name_de, source: good.source_url }));
  const goodsById = new Map(goods.map((good) => [good.id, good]));
  const goodIds = new Map();
  for (const good of allGoods) {
    goodIds.set(good.good_id.toLowerCase(), good.good_id);
    goodIds.set(good.name_en.toLowerCase(), good.good_id);
  }
  const recipesByBuilding = new Map();
  for (const recipe of colonialRecipes) {
    if (!recipesByBuilding.has(recipe.building_id)) recipesByBuilding.set(recipe.building_id, []);
    recipesByBuilding.get(recipe.building_id).push(recipe);
  }
  const buildings = colonialRows.flatMap((sourceBuilding) => {
    const building = { ...sourceBuilding, upgrades: upgradesByBuilding.get(sourceBuilding.building_id) ?? [] };
    let recipes = recipesByBuilding.get(building.building_id) ?? [];
    if (building.building_id === 'mine') recipes = recipes.filter((recipe) => ['mine_coal', 'mine_iron', 'mine_gold'].includes(recipe.recipe_id));
    return ['plantation', 'ranch', 'mine'].includes(building.building_id)
      ? genericVariants(building, recipes, goodsById, goodIds, errors)
      : [createBuilding(building, recipes, goodIds, errors)];
  });
  const ids = new Set();
  for (const building of buildings) {
    if (ids.has(building.id)) errors.push(`Doppelte Gebäude-ID ${building.id}`);
    ids.add(building.id);
  }
  return {
    schema: 1,
    scope: 'colonial',
    rateUnit: 'inventory-units-per-worker-workday',
    rateScale: RATE_SCALE,
    source: {
      files: ['manual/gebaeude.csv', 'manual/produktionsrezepte.csv', 'manual/waren.csv', 'manual/arbeitsmodi.csv', 'manual/quellen.csv', 'manual/verbesserungen.csv'],
      colonialBuildingRows: colonialRows.length,
      colonialRecipeRows: colonialRecipes.length,
      colonialModeRows: colonialModes.length,
      colonialUpgradeRows: colonialUpgrades.length,
      runtimeBuildings: buildings.length
    },
    sources: allSources.map((source) => ({
      id: source.source_id,
      title: source.title,
      url: source.url,
      usedFor: source.used_for,
      type: source.source_type,
      reliability: source.reliability,
      retrievedAt: source.retrieved_at
    })),
    goods,
    buildings,
    validation: { errors }
  };
}

export function serializeColonialData(data) {
  return `${JSON.stringify(data, null, 2)}\n`;
}
