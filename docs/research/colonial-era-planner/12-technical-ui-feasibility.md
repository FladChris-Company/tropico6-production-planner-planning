# Technische UI-Machbarkeit

Stand: 13. Juli 2026

## Ergebnis

Beide gewünschten Varianten sind mit der vorhandenen SvelteKit- und Svelte-5-Basis ohne grundlegenden Technologieumbau umsetzbar.

- Option 1 wird als zugängliche Combobox mit Suche umgesetzt.
- Option 2 wird als verschachteltes Menü auf Desktop und als Drill-down-Dialog auf Mobilgeräten umgesetzt.
- Beide Varianten verwenden dieselbe fachliche Auswahl-API.
- Das bestehende Tabellen- und Farbschema kann vollständig beibehalten werden.

## Vorhandene technische Basis

Das Repository verwendet:

- SvelteKit 2
- Svelte 5
- TypeScript
- Vite
- Vitest
- statischen Adapter
- lokale Stammdaten
- lokale Browser-Speicherung

Es gibt derzeit keine UI-Komponentenbibliothek und keine Positionierungsbibliothek. Das ist kein Blocker.

## Gemeinsame Komponentenschnittstelle

Empfohlene äußere Schnittstelle:

```ts
interface BuildingPickerProps {
  value: string | null;
  buildings: SelectableBuilding[];
  currentEra: Era;
  enabledDlcIds: string[];
  mode: 'search' | 'cascade';
  showLockedEras: boolean;
  disabled?: boolean;
  ariaLabel: string;
  onSelect: (buildingVariantId: string) => void;
  onCancel?: () => void;
}
```

`BuildingPicker.svelte` entscheidet nur anhand von `mode`, welche interne Komponente gerendert wird.

## Gemeinsames Auswahlmodell

```ts
interface SelectableBuilding {
  id: string;
  buildingId: string;
  variantId?: string;
  nameDe: string;
  nameEn: string;
  era: Era;
  categoryId: BuildingCategoryId;
  categoryName: string;
  dlcId: string;
  dlcName: string;
  inputGoodIds: string[];
  outputGoodIds: string[];
  tags: string[];
  lockedByEra: boolean;
  lockedByDlc: boolean;
  dataStatus: DataStatus;
}
```

Die Liste wird außerhalb der UI-Komponente aus Stammdaten erzeugt. Dadurch enthalten beide Varianten exakt dieselben Gebäude und Sperrregeln.

## Reaktive Ableitungen in Svelte 5

Geeignet sind:

- lokaler Öffnungszustand mit `$state`
- Suchtext mit `$state`
- aktive Option mit `$state`
- gefilterte Ergebnisse mit `$derived`
- gruppierte Ära- und Kategorieansichten mit `$derived`

Beispiel als spätere Implementierungsrichtung:

```ts
let open = $state(false);
let query = $state('');
let activeIndex = $state(0);

let filtered = $derived(
  filterBuildings(buildings, query, currentEra, enabledDlcIds)
);
```

Die Filterfunktion selbst bleibt rein und unabhängig von Svelte.

## Option 1 technisch: Such-Combobox

### Warum kein natives Select

Ein natives `select` unterstützt:

- keine frei gestaltete Suchzeile im geöffneten Menü
- keine Gruppierung mit zusätzlichen Statusinformationen in einheitlicher Browserdarstellung
- keine kontrollierte Filterung während der Eingabe

Daher wird das bisherige Select visuell nachgebildet, semantisch aber als Combobox umgesetzt.

### Empfohlene Struktur

```text
Combobox-Container
├── Eingabe/Auslöser
└── Popover
    ├── Suchfeld
    └── Listbox
        ├── Kategorieüberschrift
        └── Optionen
```

Mögliche Variante:

- Das sichtbare Feld ist direkt ein Eingabefeld mit `role="combobox"`.
- Im geschlossenen Zustand zeigt es den Gebäudenamen.
- Beim Fokussieren oder Öffnen wird der Text als Suchanfrage verwendet.

Alternativ:

- Das Feld bleibt ein Button im Select-Stil.
- Das Popover enthält ein separates Suchfeld.

Für die Treue zum aktuellen Schema wird die Button-plus-Suchfeld-Variante empfohlen. Sie verhindert, dass versehentliches Tippen den aktuellen Gebäudenamen verändert.

### ARIA-Struktur

- Auslöser mit `aria-haspopup="listbox"`
- `aria-expanded`
- `aria-controls`
- Suchfeld mit zugänglichem Namen
- Ergebniscontainer mit `role="listbox"`
- Treffer mit `role="option"`
- ausgewählter Treffer mit `aria-selected="true"`
- aktive Option über `aria-activedescendant` oder roving tabindex

### Tastaturereignisse

Am Auslöser:

- Enter, Leertaste, Pfeil nach unten: öffnen
- Escape: schließen

Im Suchfeld beziehungsweise in der Listbox:

- Pfeil nach unten: nächste Option
- Pfeil nach oben: vorherige Option
- Home: erste Option
- End: letzte Option
- Enter: aktive Option wählen
- Escape: schließen und Fokus zurück zum Auslöser
- Tab: schließen und normalen Fokusfluss fortsetzen

### Filteralgorithmus

Normalisierung:

- Kleinschreibung
- deutsche Umlaute und alternative Schreibweisen berücksichtigen
- Bindestriche und Leerzeichen vereinheitlichen
- Suchfelder vorab zu einem Indextext zusammenführen

```text
searchText =
  nameDe
  + nameEn
  + categoryName
  + DLC-Name
  + Eingangswarennamen
  + Ausgangswarennamen
  + Tags
```

Bei ungefähr 234 Gebäuden ist keine Virtualisierung notwendig. Eine einfache Filterung pro Eingabe ist ausreichend.

## Option 2 technisch: Kaskadenmenü

### Desktop-Struktur

```text
Picker-Auslöser
└── Menü Ären
    └── Untermenü Kategorien
        └── Untermenü Gebäude
```

Die Ebenen werden nebeneinander positioniert.

### Zustände

```ts
let open = $state(false);
let activeEraId = $state<Era | null>(null);
let activeCategoryId = $state<BuildingCategoryId | null>(null);
let activeBuildingId = $state<string | null>(null);
let pinnedLevel = $state<0 | 1 | 2>(0);
```

`pinnedLevel` unterscheidet zwischen bloßem Hover und per Klick beziehungsweise Tastatur geöffneten Ebenen.

### Hover-Verhalten

Die gewünschte Hover-Abzweigung ist technisch möglich. Sie benötigt jedoch Schutz vor unbeabsichtigtem Schließen:

- Öffnungsverzögerung von ungefähr 100 bis 180 Millisekunden
- Schließverzögerung von ungefähr 200 bis 350 Millisekunden
- beim Wechsel in das rechte Untermenü bleibt die linke Ebene offen
- Klick fixiert eine Ebene
- Pointer- und Tastaturzustand werden getrennt behandelt

Eine komplexe Safe-Polygon-Logik ist bei drei schmalen, direkt angrenzenden Spalten nicht zwingend erforderlich. Zwischen den Spalten darf aber keine Lücke liegen.

### Menüsemantik

- jede Ebene mit `role="menu"`
- auswählbare Gebäude mit `role="menuitem"`
- Ära- und Kategorieeinträge mit `aria-haspopup="menu"`
- `aria-expanded` für geöffnete Untermenüs
- deaktivierte Ären mit `aria-disabled="true"`

Tastatur:

- Pfeil nach unten und oben: innerhalb einer Ebene
- Pfeil nach rechts: Untermenü öffnen
- Pfeil nach links: Untermenü schließen und Fokus zum Elternpunkt
- Enter oder Leertaste: Ebene öffnen oder Gebäude wählen
- Escape: aktuelle Ebene schließen, zuletzt gesamtes Menü schließen
- Home und End: erster beziehungsweise letzter Eintrag

### Positionierung

Ohne zusätzliche Bibliothek ist folgende Lösung ausreichend:

- Auslöserposition über `getBoundingClientRect()` bestimmen
- Menüs mit `position: fixed` rendern
- verfügbare Fensterbreite und -höhe prüfen
- bei zu wenig Platz rechts Untermenüs links öffnen
- maximale Höhe setzen und intern scrollen
- bei Scrollen oder Größenänderung Position neu berechnen oder Menü schließen

Die Menüs sollten nahe der Hauptkomponente in einem obersten Overlay-Container gerendert werden, damit `overflow-x: auto` der Tabelle sie nicht abschneidet.

Möglichkeiten:

- globaler Overlay-Container im Layout
- kleine Svelte-Action zum Verschieben des Knotens unter `document.body`
- fest positionierter Container außerhalb des Tabellen-Scrollbereichs

Für die spätere Implementierung ist ein globaler Overlay-Container am saubersten.

### Optionale Bibliothek

Eine Positionierungsbibliothek wie Floating UI könnte Kollisionserkennung und automatische Platzierung vereinfachen. Sie ist nicht zwingend notwendig.

Für die bestehende schlanke Linie gilt:

- zuerst eigene kleine Positionierung für den klar begrenzten Anwendungsfall
- Bibliothek nur hinzufügen, wenn Kollisionen, Scrollcontainer oder mobile Sonderfälle zu viel eigenen Code erzeugen
- keine vollständige UI-Komponentenbibliothek allein für dieses Dropdown einführen

## Mobile technische Umsetzung

### Erkennung

Die Darstellungsform kann über CSS und eine kleine Media-Query-Abfrage gesteuert werden. Fachzustand und Auswahl bleiben identisch.

### Dialog oder Bottom Sheet

Empfohlene Struktur:

```text
Dialog
├── Kopf mit Titel und Zurück
├── aktuelle Pfadangabe
└── Liste der aktuellen Ebene
```

Ebene:

```ts
type CascadeMobileLevel =
  | { type: 'era' }
  | { type: 'category'; eraId: Era }
  | { type: 'building'; eraId: Era; categoryId: BuildingCategoryId };
```

### Fokus

- beim Öffnen Fokus auf ersten Eintrag oder Dialogtitel
- Fokus bleibt innerhalb des Dialogs
- Escape beziehungsweise Zurück schließt oder geht eine Ebene zurück
- nach Schließen Fokus zurück zum Auslöser

### Warum kein seitliches Flyout auf Mobil

- Hover existiert nicht
- drei Spalten passen nicht
- Tabellencontainer ist bereits horizontal scrollbar
- ein Drill-down ist stabiler und leichter bedienbar

## Einpassung in die aktuelle Tabelle

Das aktuelle Gebäude-Select befindet sich direkt in der ersten Tabellenzelle. Der neue Picker soll dieselbe Breite einnehmen.

Wichtig:

- Overlay darf nicht innerhalb des horizontal scrollenden Tabellencontainers abgeschnitten werden.
- die Zeilenhöhe darf durch geschlossenes Picker-Markup nicht wachsen
- der Auslöser bleibt 36 Pixel hoch
- Auswahländerung ruft dieselbe fachliche Wechselroutine auf
- ein geöffnetes Menü schließt vor dem Entfernen oder Duplizieren der Zeile

## Hinzufügen versus Ändern

### Neues Gebäude

- `Gebäude hinzufügen` öffnet einen Picker ohne aktuellen Wert.
- Erst nach Auswahl wird `newEntry` aufgerufen.
- Abbruch erzeugt keinen Eintrag.

### Bestehendes Gebäude ändern

- Picker erhält aktuellen Wert.
- aktuelle Auswahl ist markiert.
- nach Wechsel werden gültige Arbeitsmodi neu bestimmt.
- Ratenüberschreibungen werden nicht stillschweigend auf ein anderes Gebäude übertragen.

## Sperrlogik

Reine Selektorfunktion:

```ts
function getBuildingAvailability(
  building: SelectableBuilding,
  currentEra: Era,
  enabledDlcIds: string[]
): BuildingAvailability
```

Ergebnis:

```ts
type BuildingAvailability =
  | { selectable: true }
  | { selectable: false; reason: 'era'; label: string }
  | { selectable: false; reason: 'dlc'; label: string };
```

Die UI entscheidet nur über Darstellung und Interaktion, nicht über die Regel selbst.

## Kategorieableitung

Die Kaskade benötigt eine stabile Reihenfolge:

```ts
const CATEGORY_ORDER: BuildingCategoryId[] = [
  'raw-resources',
  'agriculture',
  'industry',
  'logistics',
  'food-service',
  'housing',
  'entertainment',
  'luxury-entertainment',
  'media-education',
  'public-services',
  'military',
  'government-finance'
];
```

Leere Kategorien werden ausgeblendet. Eine Kategorie mit ausschließlich gesperrten Gebäuden kann je Einstellung ausgeblendet oder deaktiviert angezeigt werden.

## CSS-Treue

Empfohlene wiederverwendete Variablen:

```css
--control-height: 36px;
--control-border: #b9c2c7;
--control-focus: #506d7c;
--surface: #ffffff;
--surface-hover: #fafbfb;
--text: #1f2529;
--text-muted: #657078;
--danger: #8a3131;
```

Popover:

- Rahmen 1 Pixel
- dezenter Schatten
- keine starke Rundung
- Kategorieüberschrift ähnlich Tabellenkopf
- aktive Zeile mit bestehendem Fokusfarbton
- deaktivierte Zeile mit reduzierter Deckkraft, aber lesbar

## Einstellungen und Persistenz

Neue globale Einstellung:

```ts
buildingPickerMode: 'search' | 'cascade'
```

Migrationsverhalten:

- fehlt das Feld, Standard `search`
- unbekannter Wert fällt auf `search` zurück
- Einstellung wird beim Wechsel sofort gespeichert
- keine Szenariomigration erforderlich

`showLockedEras` und `showEnglishNames` sind ebenfalls globale UI-Einstellungen.

DLCs bleiben projektbezogen.

## Komponentenstruktur

Empfehlung:

```text
src/lib/components/building-picker/
├── BuildingPicker.svelte
├── SearchBuildingPicker.svelte
├── CascadingBuildingPicker.svelte
├── CascadeMobileDialog.svelte
├── BuildingOption.svelte
├── picker-state.ts
├── picker-selectors.ts
└── picker-position.ts
```

Gemeinsame Aktionen:

```text
src/lib/actions/
├── click-outside.ts
├── focus-trap.ts
└── overlay-position.ts
```

Die Aktionen werden nur erstellt, wenn keine vorhandene Lösung im Repository existiert.

## Testbarkeit

Reine Funktionen werden unabhängig von DOM getestet:

- Suchnormalisierung
- Suchtreffer
- DLC-Filter
- Ära-Sperre
- Gruppierung
- Sortierung
- Auswahl des ersten gültigen Arbeitsmodus

Komponententests prüfen:

- Öffnen und Schließen
- Auswahl per Maus
- Auswahl per Tastatur
- deaktivierte Einträge
- Fokus-Rückkehr
- Wechsel der Varianten
- Mobil-Drill-down

## Technische Risiken

### Overlay im Tabellen-Scrollcontainer

Risiko: Popover wird abgeschnitten.

Gegenmaßnahme: globaler Overlay-Container oder feste Positionierung außerhalb des Containers.

### Fokusverlust bei reaktiver Filterung

Risiko: aktive Option verschwindet nach Suche.

Gegenmaßnahme: aktive Option nach jeder Filteränderung auf ersten gültigen Treffer normalisieren.

### Hover und Klick widersprechen sich

Risiko: Untermenü schließt trotz Klick.

Gegenmaßnahme: Hover-Zustand und fixierter Zustand getrennt speichern.

### Mobile Browser

Risiko: Bildschirmtastatur verdeckt Suchtreffer.

Gegenmaßnahme: Dialoghöhe über dynamische Viewport-Einheiten, Suchfeld oben fixieren, Ergebnisliste scrollen.

### Bestehende gespeicherte Gebäude aus deaktivierten DLCs

Risiko: aktueller Wert fehlt in Trefferliste.

Gegenmaßnahme: aktuelle Auswahl als nicht auswählbare Sonderoption voranstellen.

## Entscheidung

Technisch empfohlen:

- gemeinsame Picker-Abstraktion
- Suchvariante als Standard
- Kaskadenvariante als Einstellung
- keine neue große UI-Bibliothek
- Overlay außerhalb der Tabelle
- Desktop-Menüs und mobiler Drill-down teilen denselben Zustand und dieselben Selektoren
- vollständige WAI-ARIA-Tastatursteuerung
