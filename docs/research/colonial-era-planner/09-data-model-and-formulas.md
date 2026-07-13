# Datenmodell und Formeln

Stand: 13. Juli 2026

## Ziel

Das Datenmodell soll die bestehenden Produktionsdaten weiterverwenden, aber Varianten, Nahrung, Wohnen, DLCs, Ära-Freischaltungen und Datenqualität sauber trennen.

## Einheiten

### Warenbestands-Einheit

Alle Warenmengen werden intern in den Einheiten geführt, die in Gebäude- und Transportlagern sichtbar sind.

```text
inventory-unit
```

### Gemessene Ratenpunkte

Der Community-Guide verwendet Ratenpunkte, die jeweils 1.000 Warenbestands-Einheiten entsprechen.

```text
1 measured-rate-unit = 1.000 inventory-units
```

### Zeitbasis

- Stammdaten: je Arbeiter-Arbeitstag
- Anzeige: je theoretischem Monat
- Umrechnung: `theoreticalWorkdaysPerMonth`

### Prozentwerte

Intern als Dezimalfaktor:

- 100 Prozent = 1,0
- 135 Prozent = 1,35

In Formularen als Prozentzahl anzeigen.

## Datenstatus

Empfohlene Erweiterung:

```ts
type DataStatus =
  | 'verified'
  | 'measured'
  | 'derived'
  | 'model'
  | 'conflicting'
  | 'unknown';
```

Zusätzlich pro Wert:

```ts
interface SourcedValue<T> {
  value: T | null;
  status: DataStatus;
  sourceIds: string[];
  note?: string;
  alternatives?: Array<{
    value: T;
    sourceId: string;
  }>;
}
```

Damit können Quellenkonflikte auf Feldebene statt nur auf Gebäudeebene abgebildet werden.

## Ära

```ts
type Era = 'colonial' | 'world-wars' | 'cold-war' | 'modern';
```

Jede freischaltbare Einheit besitzt `availableFrom`:

- Gebäude
- Gebäudevariante
- Arbeitsmodus
- Verbesserung

## DLC

```ts
interface DlcDefinition {
  id: string;
  name: string;
  requiredFor: string[];
}
```

Grundspiel wird als `base` geführt und kann nicht deaktiviert werden.

## Gebäude-Stammdaten

```ts
interface BuildingDefinition {
  id: string;
  nameDe: string;
  nameEn: string;
  categoryId: BuildingCategoryId;
  kind: BuildingKind;
  dlcId: string;
  availableFrom: Era;
  blueprintCost: SourcedValue<number>;
  constructionCost: SourcedValue<number>;
  workerSlots: SourcedValue<number>;
  education: EducationLevel | null;
  size: SourcedValue<BuildingSize>;
  roadRequired: boolean | null;
  placement: PlacementRule[];
  modeIds: string[];
  upgradeIds: string[];
  variantIds: string[];
  sourceIds: string[];
}
```

## Gebäudekategorien

Stabile IDs statt freier deutscher Texte:

```ts
type BuildingCategoryId =
  | 'raw-resources'
  | 'agriculture'
  | 'industry'
  | 'logistics'
  | 'food-service'
  | 'housing'
  | 'entertainment'
  | 'luxury-entertainment'
  | 'media-education'
  | 'public-services'
  | 'military'
  | 'government-finance';
```

Anzeigenamen werden separat lokalisiert.

## Gebäudetypen

```ts
type BuildingKind =
  | 'production'
  | 'logistics'
  | 'food-service'
  | 'housing'
  | 'support'
  | 'infrastructure';
```

Dadurch müssen Wohn- und Versorgungsgebäude nicht mehr als Infrastruktur ohne Fachwerte behandelt werden.

## Gebäudevarianten

Plantage, Ranch, Mine und Fischereihafen besitzen auswählbare Varianten.

```ts
interface BuildingVariant {
  id: string;
  buildingId: string;
  nameDe: string;
  nameEn: string;
  availableFrom: Era;
  primaryGoodId?: string;
  recipeIds: string[];
  tags: string[];
}
```

Beispiele:

- `plantation-sugar`
- `ranch-cattle`
- `mine-gold`
- `fishermen-wharf-shellfish`

Die UI darf Varianten wie eigenständige Gebäude anzeigen. Intern bleiben gemeinsame Kosten und Arbeitsplätze am Stammgebäude.

## Waren

```ts
interface GoodDefinition {
  id: string;
  nameDe: string;
  nameEn: string;
  availableFrom: Era;
  categories: Array<
    | 'food'
    | 'consumer-good'
    | 'luxury-good'
    | 'raw-material'
    | 'processed-good'
  >;
  exportValuePer1000?: SourcedValue<number>;
  iconRef?: string;
}
```

Eine Ware kann mehrere Kategorien besitzen. `food` ist entscheidend für das Nahrungsmodul.

## Rezepte und Arbeitsmodi

```ts
interface ProductionRecipe {
  id: string;
  buildingId: string;
  variantId?: string;
  modeId: string;
  availableFrom: Era;
  inputs: RecipeRate[];
  outputs: RecipeRate[];
  rateBasis: 'per-worker-workday';
  inventoryUnitScale: number;
  dataStatus: DataStatus;
  sourceIds: string[];
}

interface RecipeRate {
  goodId: string;
  amount: number | null;
  status: DataStatus;
}
```

Arbeitsmodus-Metadaten:

```ts
interface WorkModeDefinition {
  id: string;
  buildingId: string;
  nameDe: string;
  nameEn: string;
  availableFrom: Era;
  recipeId?: string;
  modifiers: Modifier[];
  description: string;
}
```

## Verbesserungen

```ts
interface UpgradeDefinition {
  id: string;
  buildingId: string;
  nameDe: string;
  nameEn: string;
  availableFrom: Era;
  cost: SourcedValue<number>;
  modifiers: Modifier[];
  sourceIds: string[];
}
```

## Modifikatoren

```ts
type Modifier =
  | { type: 'efficiency-add'; value: number }
  | { type: 'efficiency-multiply'; value: number }
  | { type: 'worker-slots-add'; value: number }
  | { type: 'households-add'; value: number }
  | { type: 'housing-quality-add'; value: number }
  | { type: 'upkeep-multiply'; value: number }
  | { type: 'minimum-wealth-set'; value: WealthLevel }
  | { type: 'rent-disable' }
  | { type: 'storage-add'; goodId: string; value: number }
  | { type: 'support-radius'; value: number }
  | { type: 'custom-model'; key: string; value: number };
```

## Unterstützungsgebäude

```ts
interface SupportEffectDefinition {
  id: string;
  buildingId: string;
  targetBuildingIds?: string[];
  targetCategoryIds?: BuildingCategoryId[];
  radiusCells?: number;
  inputGoodId?: string;
  effect: Modifier;
  dataStatus: DataStatus;
}
```

Damit lassen sich Miststreuer, künstliches Korallenriff und Nachbarschaftseffekte erfassen, ohne sie als Produktionsrezepte zu missbrauchen.

## Wohndaten

```ts
interface HousingProfile {
  buildingId: string;
  modeId: string;
  households: SourcedValue<number>;
  housingQuality: SourcedValue<number>;
  minimumWealth: WealthLevel;
  rentPerHousehold?: SourcedValue<number>;
  upkeep?: SourcedValue<number>;
}
```

```ts
type WealthLevel =
  | 'broke'
  | 'poor'
  | 'well-off'
  | 'rich'
  | 'filthy-rich';
```

## Nahrungsdienst

```ts
interface FoodServiceProfile {
  buildingId: string;
  visitors: SourcedValue<number>;
  baseServiceQuality: SourcedValue<number>;
  minimumWealth: WealthLevel;
  acceptsFood: boolean;
  acceptsConsumerGoods: boolean;
  varietyEffect: SourcedValue<number>;
}
```

Die unbekannte Vielfaltformel wird als `null` mit Status `unknown` gespeichert, nicht als frei erfundene Zahl.

## Inselprojekt-Einstellungen

```ts
interface ProjectSettings {
  era: Era;
  enabledDlcIds: string[];
  population: number | null;
  theoreticalWorkdaysPerMonth: number;
  foodNeedPerResidentPerMonth: number | null;
  foodSafetyReservePercent: number;
  localFoodConsumptionShare: number;
  minimumFoodVarietyAmount: number;
  teamsterModel: TeamsterModelSettings;
}
```

## Globale UI-Einstellungen

```ts
interface UiSettings {
  buildingPickerMode: 'search' | 'cascade';
  showLockedEras: boolean;
  showEnglishNames: boolean;
  groupSearchResults: boolean;
  compact: boolean;
  tooltips: boolean;
  numberDisplayUnit: 'month' | 'worker-workday';
}
```

## Transportmodell-Einstellungen

```ts
interface TeamsterModelSettings {
  enabled: boolean;
  loadPerTrip: number;
  tripsPerWorkerPerWorkday: number;
  referenceStaffingRate: number;
  referenceEfficiencyRate: number;
  safeLoadModeFactor: number;
  looseLoadModeFactor: number;
}
```

## Szenarioeintrag

```ts
interface BuildingEntry {
  id: string;
  buildingVariantId: string;
  modeId: string;
  count: number;
  efficiencyPercent: number;
  staffingPercent: number;
  status: 'existing' | 'planned' | 'disabled';
  manualRateOverrides: RateOverrides;
  supportConfiguration?: SupportConfiguration;
  housingOverrides?: HousingOverrides;
}
```

Entfernung bleibt für den aktuellen Auftrag außerhalb der Berechnung und kann aus der einfachen Eingabe entfernt oder ignoriert werden.

## Warenrichtlinien

```ts
interface GoodPolicy {
  goodId: string;
  openingStock: number;
  externalSupplyMonthly: number;
  protectedReserveMonthly: number;
  foodReserveMonthly: number;
  exportEnabled: boolean;
  localConsumptionShare?: number;
  allocationPriority?: string[];
}
```

## Abgeleitete Produktionswerte

```ts
interface ProductionResult {
  buildingEntryId: string;
  maximumInputsMonthly: Record<string, number>;
  maximumOutputsMonthly: Record<string, number>;
  configuredInputsMonthly: Record<string, number>;
  configuredOutputsMonthly: Record<string, number>;
  supportedInputsMonthly: Record<string, number>;
  supportedOutputsMonthly: Record<string, number>;
  recipeUtilization: number;
  calculable: boolean;
  dataStatuses: DataStatus[];
}
```

## Abgeleitete Nahrungswerte

```ts
interface FoodResult {
  productionByGood: Record<string, number | null>;
  availableByGood: Record<string, number | null>;
  totalAvailable: number | null;
  demand: number | null;
  difference: number | null;
  coveragePercent: number | null;
  productionVariety: number;
  availableVariety: number;
  groceryVariety: number;
  missingFoodGoodIds: string[];
  completeness: 'complete' | 'partial' | 'uncalibrated';
}
```

## Abgeleitete Wohnwerte

```ts
interface HousingResult {
  householdCapacity: number;
  capacityByMinimumWealth: Record<WealthLevel, number>;
  weightedHousingQuality: number | null;
  constructionCost: number;
  missingBlueprintCost: number;
  shackHouseholds: number;
  conflictingValueCount: number;
}
```

## Abgeleitete Logistikwerte

```ts
interface LogisticsResult {
  transportDemandMonthly: number | null;
  transportCapacityMonthly: number;
  difference: number | null;
  utilizationPercent: number | null;
  requiredOfficeCount: number | null;
  officeDifference: number | null;
  flowBreakdown: LogisticsFlow[];
  completeness: 'complete' | 'partial';
}
```

## Formelkatalog

### Rate zu Warenbestands-Einheiten

```text
inventoryAmount = measuredRate × 1.000
```

### Monatsproduktion

```text
monthlyOutput =
  rate
  × 1.000
  × workerSlots
  × count
  × efficiencyRate
  × staffingRate
  × theoreticalWorkdaysPerMonth
```

### Unterstützte Produktionsauslastung

```text
recipeUtilization =
  min(1, verfügbare Eingangsware / vollständiger Eingangsbedarf)
```

### Transportbedarf

```text
transportDemand =
  Summe(zugewiesene Warenmenge × Transportanteil)
```

### Transportkapazität

```text
transportCapacity =
  Büros
  × Stellen
  × Besetzung
  × Effizienz
  × Ladung
  × Fahrten je Arbeitstag
  × Arbeitstage je Monat
  × Modusfaktor
```

### Nahrung

```text
foodDemand =
  Bevölkerung
  × Bedarf je Einwohner und Monat
  × Sicherheitsreserve
```

### Wohnkapazität

```text
householdCapacity =
  Gebäudeanzahl × Haushalte je Gebäude nach Arbeitsmodus
```

### Gewichtete Wohnqualität

```text
weightedHousingQuality =
  Summe(Wohnqualität × Haushaltsplätze)
  / Summe(Haushaltsplätze)
```

## Validierungsregeln

- IDs sind eindeutig.
- Jedes Rezept verweist auf vorhandene Waren.
- Jeder Arbeitsmodus gehört zum angegebenen Gebäude.
- Arbeitsmodus-Ära ist nicht früher als Gebäude-Ära.
- DLC eines Modus oder einer Variante ist nicht ohne zugehöriges Gebäude aktivierbar.
- Raten sind nicht negativ.
- Unbekannte Raten bleiben `null`, nicht `0`.
- `0` bedeutet eine bestätigte Nullmenge.
- Produktionsstufen bilden keinen Zyklus.
- Lebensmittel besitzen die Kategorie `food`.
- Wohngebäude besitzen ein HousingProfile.
- Modellwerte sind nicht als `verified` markiert.
- Quellenkonflikte werden nicht durch Auswahl eines beliebigen Werts verschwiegen.

## Datenhaltung

Empfohlene Trennung:

- unveränderliche Stammdaten im Repository
- Nutzereinstellungen im lokalen Speicher
- Szenarien im lokalen Speicher
- manuelle Ratenüberschreibungen pro Szenario
- Quellenregister in den Stammdaten

CSV kann weiterhin als Recherche- und Importformat dienen. Für die Anwendung sind typisierte TypeScript- oder JSON-Stammdaten geeigneter.
