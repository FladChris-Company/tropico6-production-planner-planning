# Produktionsmodell Kolonialzeit

Stand: 13. Juli 2026

## Ziel

Das Produktionsmodell beantwortet für den kolonialen Inselstand:

- Wie viel produziert jedes Gebäude theoretisch pro Monat?
- Wie viel verbraucht die Industrie theoretisch pro Monat?
- Welche Gebäude können mit den vorhandenen Rohstoffen vollständig versorgt werden?
- Wie viel Überschuss oder Fehlmenge entsteht je Ware?
- Wie viele Rohstoffgebäude werden für ein gewünschtes Endgebäude oder eine Zielmenge benötigt?
- Welche Ergebnisse beruhen auf belegten, gemessenen oder modellierten Werten?

Es werden keine Wege, Abwesenheiten, Verkehrsstörungen oder Lagerblockaden simuliert.

## Kritische Einheitennormalisierung

Die Messwerte des Steam-Guides werden als Mengen je Arbeiter-Arbeitstag bei 100 Prozent Effizienz angegeben. Die dortige Gewinnrechnung verwendet Warenpreise je 1.000 Warenbestands-Einheiten.

Beispiel Rumdestillerie im Normalbetrieb:

`3,5 × 9,2 - 6,8 × 2,5 = 15,2`

Das Ergebnis stimmt nur, wenn 3,5 für 3.500 Rum und 6,8 für 6.800 Zucker stehen. Deshalb gilt:

`inventoryUnitScale = 1.000`

Alle gemessenen Produktions- und Verbrauchsraten werden vor der weiteren Berechnung mit 1.000 multipliziert.

Diese Normalisierung ist erforderlich, damit Produktionsmengen mit der Transportladung von 500 Warenbestands-Einheiten vergleichbar sind.

## Kanonische Stammdateneinheit

Ein Rezept speichert:

- Eingangsrate je Arbeiter-Arbeitstag
- Ausgangsrate je Arbeiter-Arbeitstag
- Skalierungsfaktor 1.000 Warenbestands-Einheiten je Ratenpunkt
- Datenstatus
- Quelle
- früheste Ära des Arbeitsmodus

Beispiel:

```text
Rumdestillerie, Dunder-Destille
Eingang: 5,1 Zucker
Ausgang: 3,5 Rum
Skalierung: 1.000
```

Das entspricht je aktivem Arbeiter-Arbeitstag:

- 5.100 Zucker Verbrauch
- 3.500 Rum Produktion

## Monatsmodell

### Parameter

- `count`: Gebäudeanzahl
- `workerSlots`: Arbeitsplätze je Gebäude
- `staffingRate`: Besetzung von 0 bis 1
- `efficiencyRate`: Effizienz von 0 bis 5
- `theoreticalWorkdaysPerMonth`: konfigurierbare Modellannahme
- `ratePerWorkerWorkday`: gemessene Rate
- `inventoryUnitScale`: 1.000

### Maximale Monatskapazität

Die maximale Kapazität nimmt vollständige Besetzung an:

```text
maximumMonthlyAmount =
  count
  × workerSlots
  × ratePerWorkerWorkday
  × inventoryUnitScale
  × efficiencyRate
  × theoreticalWorkdaysPerMonth
```

### Konfigurierte theoretische Monatsleistung

```text
configuredMonthlyAmount =
  maximumMonthlyAmount
  × staffingRate
```

### Warum zwei Werte?

- Die maximale Kapazität zeigt, was die gebauten Gebäude bei voller Besetzung leisten könnten.
- Die konfigurierte theoretische Leistung berücksichtigt die vom Nutzer eingetragene Besetzung.
- Beide Werte ignorieren Wege und reale Anwesenheitsverluste.

## Beispiel Zuckerplantagen

Fünf Zuckerplantagen mit je acht Arbeitsplätzen, 100 Prozent Effizienz, 100 Prozent Besetzung und 30 theoretischen Arbeitstagen:

```text
5 × 8 × 1,5 × 1.000 × 1,00 × 30
= 1.800.000 Zucker pro theoretischem Monat
```

Dies erklärt, warum eine unskalierte Anzeige von ungefähr 13,8 oder 60 Einheiten nicht mit den Warenlagern und Transportladungen zusammenpasst.

## Belastbare koloniale Grundraten

Alle Werte in der Tabelle sind Ratenpunkte je Arbeiter-Arbeitstag. Für Warenbestands-Einheiten werden sie mit 1.000 multipliziert.

### Plantagen

| Variante | Ausgangsrate |
|---|---:|
| Mais | 2,0 |
| Bananen | 2,5 |
| Ananas | 2,5 |
| Zucker | 1,5 |
| Kakao | 1,0 |
| Tabak | 1,8 |
| Kaffee | 1,0 |
| Baumwolle | 3,5 |
| Kautschuk | 1,2 |

### Ranches

| Variante | Ausgangsraten |
|---|---|
| Rinder | 1,5 Fleisch und 2,0 Häute |
| Schafe | 1,5 Wolle und 0,5 Milch |
| Krokodile | 0,8 Leder |
| Schweine | 2,0 Fleisch |
| Lamas | 2,0 Wolle |
| Ziegen | 2,0 Milch |

### Minen

| Variante | Ausgangsrate |
|---|---:|
| Kohle | 2,0 |
| Eisen | 2,0 |
| Gold | 0,6 |

### Industrie des Grundspiels

| Gebäude und Modus | Eingänge | Ausgänge |
|---|---|---|
| Sägewerk, Normalbetrieb | 4,0 Holzstämme | 10,0 Bretter |
| Sägewerk, schnelles Entrinden | 6,8 Holzstämme | 13,0 Bretter |
| Rumdestillerie, Normalbetrieb | 6,8 Zucker | 3,5 Rum |
| Rumdestillerie, Dunder-Destille | 5,1 Zucker | 3,5 Rum |
| Gerberei, Normalbetrieb | 3,65 Häute | 1,825 Leder |
| Gerberei, Chromgerbung | 2,725 Häute | 1,825 Leder |

## Koloniale DLC-Raten

### Return to Nature

Diese Werte stammen aus einer Community-Nachmessung und erhalten den Status `measured-community`, nicht dieselbe Vertrauensstufe wie der ursprüngliche Guide.

| Gebäude und Modus | Eingänge | Ausgänge |
|---|---|---|
| Köhlerei | 3,2 Holzstämme | 7,0 Kohle |
| Papiermühle, Holz | 4,0 Holzstämme | 10,0 Papier |
| Papiermühle, Kokosnüsse | 3,66 Kokosnüsse | 10,0 Papier |
| Papiermühle, Baumwolle | 4,5 Baumwolle | 10,0 Papier |
| Papiermühle, Wolle | 2,5 Wolle | 10,0 Papier |
| Druckerei, Papier | 10,8 Papier | 4,0 Bücher |
| Druckerei, Ledereinband | 6,0 Papier und 2,0 Leder | 4,0 Bücher |
| Imkerei | – | 1,5 Zucker |

### Tropican Shores

- Perlentaucher: 0,8 Perlen je Arbeiter-Arbeitstag als Community-Messwert
- Gebäudetabelle: vier Arbeitsplätze
- eine Community-Angabe nennt abweichend sechs Arbeiter

Für die Berechnung werden vier Arbeitsplätze aus der vollständigen Gebäudetabelle verwendet; der Konflikt wird im Quellenregister festgehalten.

### The Llama of Wall Street

Für die Spielzeugfabrik existieren Testchargen mit ungefähr 1.000 Eingangsware. Diese sind nicht sauber auf Arbeiter-Arbeitstage normiert und dürfen deshalb nicht direkt in dieselbe Ratentabelle übernommen werden.

Kolonial relevant ist zunächst nur:

- Arbeitsmodus Holzspielzeug
- Eingang Holzstämme
- Ausgang Spielzeug

Die Mengen bleiben `unknown`, bis sie reproduzierbar je Arbeiter-Arbeitstag gemessen oder aus Spieldaten extrahiert wurden.

### Festival

Für die Feuerwerksfabrik sind die Warenkombinationen bekannt, aber keine ausreichend belastbaren, einheitlich normierten Produktionsraten. Die Rezepte bleiben sichtbar, Ergebnisse werden als nicht berechenbar markiert.

## Noch fehlende koloniale Grundraten

- Holzfällerlager
- Kokosnussernter
- Fischereihafen: Fisch
- Fischereihafen: Schalentiere

Der bisherige Holzfällerlagerwert ist ein Kalibrierwert und darf nicht als bestätigte Spielrate erscheinen.

## Arbeitsmodi und Ära

Jeder Arbeitsmodus benötigt ein eigenes Feld `availableFrom`.

Beispiel Spielzeugfabrik:

- Holzspielzeug: Kolonialzeit
- Stoffspielzeug: Weltkriege
- Gummispielzeug: Kalter Krieg
- ferngesteuertes Spielzeug: Moderne

Die Verfügbarkeit des Gebäudes allein reicht nicht aus, um die Arbeitsmodi korrekt zu filtern.

## Effizienzmodifikatoren

Effizienz wird als zusammengesetzter Faktor behandelt:

```text
finalEfficiency =
  userEfficiency
  × modeModifier
  × upgradeModifier
  × supportModifier
```

Für die erste Ausbaustufe gilt:

- manuell eingegebene Gesamteffizienz bleibt die einfachste Eingabe
- bekannte Arbeitsmodusfaktoren können automatisch vorgeschlagen werden
- nicht exakt berechenbare Nachbarschaftseffekte werden nicht automatisch erfunden
- ein automatisch berechneter Wert kann vom Nutzer überschrieben werden
- der Tooltip zeigt automatisch berücksichtigte Modifikatoren einzeln

## Produktionsstufen

Empfohlene Stufen für die Kolonialzeit:

- Stufe 0: Rohstofferzeugung
- Stufe 1: erste Verarbeitung
- Stufe 2: weitere Verarbeitung
- Stufe 90: Verteilung und Versorgung
- Stufe 99: Infrastruktur ohne Warenrezept

Beispiele:

- Holzfällerlager: Stufe 0
- Sägewerk: Stufe 1
- Papiermühle: Stufe 1
- Druckerei: Stufe 2

## Szenariobilanz

### Vollbedarf einer Stufe

```text
fullInputDemand[good] =
  Summe aller konfigurierten theoretischen Eingänge der Stufe
```

### Verfügbare Menge

```text
available[good] =
  Produktion vorheriger Stufen
  + externe Versorgung
  + Anfangsbestand
  - feste Reserve
```

### Versorgungsgrad

```text
supplyRatio[good] = min(1, available[good] / fullInputDemand[good])
```

Bei mehreren Eingängen begrenzt der knappste Eingang das Rezept:

```text
recipeUtilization = min(supplyRatio aller Eingänge)
```

### Tatsächlich unterstützte theoretische Produktion

```text
supportedOutput = configuredMonthlyOutput × recipeUtilization
```

Die Bezeichnung `tatsächlich` wird vermieden, weil weiterhin keine reale Simulation stattfindet. Empfohlen ist `durch Rohstoffe unterstützte theoretische Produktion`.

## Gemeinsame Rohstoffe mehrerer Verbraucher

Ein Rohstoff kann gleichzeitig für Nahrung, Industrie und Export relevant sein. Beispiele:

- Kokosnüsse für Nahrung, Papier und Feuerwerk
- Mais für Nahrung und Feuerwerk
- Häute für Gerberei und später Bücher mit Ledereinband
- Holzstämme für Bretter, Spielzeug, Kohle, Papier und Feuerwerk

Die Verteilung benötigt eine deterministische Strategie.

Empfohlene Standardreihenfolge:

- vom Nutzer festgelegte Mindestreserve
- fest zugewiesene Zielketten
- vorhandene Industrie proportional zu ihrem Vollbedarf
- Nahrungsreserve
- Exportüberschuss

Alternativ kann pro Ware eine Priorität eingestellt werden. Ohne Priorität erfolgt eine proportionale Aufteilung und kein zufälliges Reihenfolgeergebnis.

## Rückwärtsrechnung nach Anno-Muster

Für ein Zielgebäude oder eine Zielmenge:

- Zielrezept und Arbeitsmodus bestimmen
- vollständigen Monatsbedarf der Eingänge berechnen
- für jede Eingangsware geeignete aktive Produzenten bestimmen
- benötigte theoretische Gebäudeanzahl berechnen
- rekursiv bis zu Rohstoffgebäuden fortsetzen
- exakten Bedarf und aufgerundete Bauanzahl getrennt zeigen
- Überschuss durch Aufrundung ausweisen
- DLC-Verfügbarkeit und Datenstatus berücksichtigen

Formel:

```text
exactBuildingNeed = requiredMonthlyOutput / monthlyOutputPerBuilding
recommendedBuildingCount = ceil(exactBuildingNeed)
roundingReserve =
  recommendedBuildingCount × monthlyOutputPerBuilding
  - requiredMonthlyOutput
```

## Auswahl eines Produzenten

Es darf nicht stillschweigend immer der erste oder ertragreichste Produzent gewählt werden.

Empfohlene Regeln:

- bereits im Ziel verwendete Variante bevorzugen
- aktive DLCs berücksichtigen
- nur in der aktuellen Ära verfügbare Arbeitsmodi anbieten
- Grundspiel nicht grundsätzlich bevorzugen, wenn der Nutzer einen DLC-Produzenten gewählt hat
- bei mehreren Quellen Auswahl anzeigen
- Nutzerentscheidung im Produktionsziel speichern

Beispiel Zucker:

- Zuckerplantage
- Imkerei, wenn Return to Nature aktiv ist

## Ausgaben pro Gebäudezeile

- maximale Produktion pro Monat
- konfigurierte theoretische Produktion pro Monat
- theoretischer Verbrauch pro Monat
- durch vorhandene Rohstoffe unterstützte Produktion
- Auslastung durch Rohstoffversorgung
- Überschuss oder Fehlmenge
- Datenstatus
- vollständiger Berechnungsweg

## Ausgaben der Gesamtübersicht

- Produktion je Ware
- Industrieverbrauch je Ware
- Nahrungsreserve je essbarer Ware
- externer Bezug
- Restbestand
- Exportüberschuss
- nicht gedeckter Bedarf
- Zahl der Gebäude mit unbekannter Rate
- betroffene Ketten und Arbeitsmodi

## Bewusst nicht berechnet

- reale Produktion pro Kalenderzeit
- Fahr- und Gehzeiten
- Pausen und Bedürfnisse
- Ausgangslagerblockaden
- exakte Bodenfruchtbarkeitsentwicklung
- nicht dokumentierte Wirkungsstärken von Weltwundern
