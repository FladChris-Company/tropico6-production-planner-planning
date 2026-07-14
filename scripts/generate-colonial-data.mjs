import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateColonialData, serializeColonialData } from './lib/colonial-data.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(root, 'src/lib/domain/generated/colonial-data.json');
const [buildingsCsv, recipesCsv, goodsCsv, modesCsv, sourcesCsv, upgradesCsv] = await Promise.all([
  readFile(resolve(root, 'manual/gebaeude.csv'), 'utf8'),
  readFile(resolve(root, 'manual/produktionsrezepte.csv'), 'utf8'),
  readFile(resolve(root, 'manual/waren.csv'), 'utf8'),
  readFile(resolve(root, 'manual/arbeitsmodi.csv'), 'utf8'),
  readFile(resolve(root, 'manual/quellen.csv'), 'utf8'),
  readFile(resolve(root, 'manual/verbesserungen.csv'), 'utf8')
]);
const data = generateColonialData({ buildingsCsv, recipesCsv, goodsCsv, modesCsv, sourcesCsv, upgradesCsv });

if (data.validation.errors.length) {
  console.error(data.validation.errors.join('\n'));
  process.exit(1);
}

const serialized = serializeColonialData(data);
if (process.argv.includes('--check')) {
  const current = await readFile(outputPath, 'utf8').catch(() => '');
  if (current !== serialized) {
    console.error('Die generierten Kolonialdaten sind nicht aktuell. Führe npm run data:generate aus.');
    process.exit(1);
  }
  console.log(`${data.source.runtimeBuildings} koloniale Gebäudeauswahlen geprüft.`);
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serialized, 'utf8');
  console.log(`${data.source.runtimeBuildings} koloniale Gebäudeauswahlen generiert.`);
}
