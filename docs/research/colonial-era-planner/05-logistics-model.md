# Logistikmodell Kolonialzeit

Stand: 13. Juli 2026

## Ziel

Das Logistikmodell beantwortet vier Fragen:

- Wie viele Waren müssen theoretisch bewegt werden?
- Wie viele Waren können die eingetragenen Transportbüros im Modell bewegen?
- Wie groß ist die Differenz?
- Wie viele Transportbüros wären nach der gewählten Modellannahme mehr oder weniger erforderlich?

Es simuliert keine Straßen, Entfernungen, Staus, Rückwege oder Prioritätsentscheidungen der Spiel-KI.

## Strikte Trennung zweier Ebenen

### Ebene A: theoretisches Frachtvolumen

Das Frachtvolumen wird aus den Produktions- und Verbrauchsbeziehungen abgeleitet. Es ist bei vollständigen Produktionsdaten vergleichsweise belastbar.

### Ebene B: Transportbüro-Kapazität

Die Kapazität wird aus Ladung, Stellen, Besetzung, Effizienz und angenommener Fahrtenzahl modelliert. Sie ist keine dokumentierte exakte Spielkonstante.

Die Oberfläche muss diese Ebenen unterschiedlich kennzeichnen:

- Frachtvolumen: `abgeleitet`
- Transportkapazität: `Modellannahme`

## Gemeinsame Einheit

Alle Mengen werden in Warenbestands-Einheiten geführt.

Die Produktionsraten des Community-Guides werden vor der Logistikberechnung mit 1.000 skaliert. Erst danach sind sie mit einer Transportladung von 500 Einheiten vergleichbar.

## Was als Transport zählt

Eine Warenmenge zählt genau dann als Fracht, wenn sie im Szenario einen Ortswechsel benötigt.

Typische Frachtbeziehungen:

- Rohstoffgebäude zu Industrie
- Rohstoffgebäude zum Lebensmittelladen
- Rohstoffgebäude zum Hafen
- Industrie zum nächsten Verarbeitungsgebäude
- Industrie zum Hafen
- Hafen zu einem inländischen Empfänger bei Import
- Lagerhaus zu einem späteren Empfänger, wenn der Nutzer diesen Transfer ausdrücklich modelliert

Nicht automatisch als Fracht zählen:

- Nahrung, die direkt am Produktionsgebäude lokal konsumiert wird
- Ware, die im Ausgangslager verbleibt
- rein rechnerische Reserve ohne geplanten Zielort
- Miststreuerwirkung ohne dokumentierte transportierte Mistmenge

## Keine Doppelzählung derselben Transportetappe

Jede reale Warenetappe wird einmal gezählt.

Beispiel Rum:

- Zuckerplantage zur Rumdestillerie: Zucker wird einmal gezählt
- Rumdestillerie zum Hafen: Rum wird einmal gezählt

Die Fabrikeingabe wird nicht erneut addiert, wenn die Ausgabe des Liefergebäudes bereits als genau diese Etappe erfasst wurde.

Mehrstufige Ketten erzeugen mehrere unterschiedliche Etappen:

- Holzfällerlager zur Papiermühle
- Papiermühle zur Druckerei
- Druckerei zum Hafen

Hier werden Holzstämme, Papier und Bücher jeweils einmal gezählt, weil es drei eigenständige Warenbewegungen sind.

## Empfohlenes Flussmodell

Jede produzierte Warenmenge erhält eine Verwendung:

- `industry`
- `foodDistribution`
- `localConsumption`
- `export`
- `storage`
- `unassigned`

Dazu wird je Verwendung ein Transportanteil gespeichert.

Empfohlene Standardwerte:

| Verwendung | Transportanteil |
|---|---:|
| Industrie | 100 % |
| Lebensmittelladen | 100 % |
| lokaler Konsum am Erzeuger | 0 % |
| Export | 100 % |
| im Ausgangslager verbleibend | 0 % |
| externer Import zum Empfänger | 100 % |

Formel:

```text
flowTransportAmount = allocatedAmount × transportShare
```

Gesamt:

```text
transportDemandMonthly = Summe aller flowTransportAmount
```

## Vereinfachung für den ersten Ausbau

Wenn noch keine explizite Warenverteilung vorhanden ist, kann die bestehende Methode als Fallback dienen:

```text
transportDemandMonthly =
  Summe aller produzierten Monatsausgänge
  + Summe aller importierten Monatsmengen
  - direkt lokal konsumierte Monatsmengen
```

Diese Methode zählt jede Produktionsstufe einmal und ist für eine theoretische Gesamtbelastung brauchbar. Der Tooltip muss erklären, dass Zielorte und Lagerbewegungen nicht simuliert werden.

## Transportbüro-Kapazitätsmodell

### Parameter

- `officeCount`
- `workerSlotsPerOffice`: 6
- `staffingRate`
- `efficiencyRate`
- `loadPerTrip`: 500 Warenbestands-Einheiten
- `tripsPerWorkerPerWorkday`: sichtbare Modellannahme
- `theoreticalWorkdaysPerMonth`
- `modeFactor`

### Formel

```text
teamsterCapacityMonthly =
  officeCount
  × workerSlotsPerOffice
  × staffingRate
  × efficiencyRate
  × loadPerTrip
  × tripsPerWorkerPerWorkday
  × theoreticalWorkdaysPerMonth
  × modeFactor
```

### Standardannahmen

- sichere Ladung: Faktor 1,00
- lockere Ladegrenzen: Modellfaktor 1,35
- zwei theoretische Fahrten je Arbeiter-Arbeitstag
- 30 theoretische Arbeitstage je Modellmonat

Diese Werte bleiben in den Einstellungen sichtbar und veränderbar. Sie sind keine Behauptung über die reale Fahrtenzahl.

### Beispiel eines vollständig besetzten Transportbüros

```text
1 × 6 × 1,00 × 1,00 × 500 × 2 × 30 × 1,00
= 180.000 Warenbestands-Einheiten pro Modellmonat
```

Für einen einzelnen Modell-Arbeitstag entspricht dies 6.000 Einheiten.

## Bedarf an Transportbüros

Kapazität eines Referenzbüros:

```text
referenceOfficeCapacity =
  workerSlotsPerOffice
  × loadPerTrip
  × tripsPerWorkerPerWorkday
  × theoreticalWorkdaysPerMonth
  × referenceEfficiency
  × referenceStaffing
  × referenceModeFactor
```

Benötigte Büros:

```text
requiredOfficeCount = ceil(
  transportDemandMonthly / referenceOfficeCapacity
)
```

Differenz:

```text
officeDifference = requiredOfficeCount - existingOfficeCount
```

Ausgabe:

- größer null: `X Transportbüros mehr einplanen`
- gleich null: `Anzahl passt im gewählten Modell`
- kleiner null: `Bis zu X Transportbüros rechnerische Reserve`

Die Formulierung `weniger bauen` sollte bei bestehenden Inselständen vorsichtig verwendet werden, weil das Modell Wege und Spitzenlasten nicht kennt.

## Kapazitätsreserve

```text
transportDifference =
  teamsterCapacityMonthly - transportDemandMonthly
```

```text
transportUtilization =
  transportDemandMonthly / teamsterCapacityMonthly × 100
```

Statusvorschlag:

- bis 70 Prozent: ausreichend
- über 70 bis 90 Prozent: knapp
- über 90 bis 100 Prozent: Risiko
- über 100 Prozent: theoretisches Defizit

Diese Grenzen sind Produktregeln, keine Spielkonstanten, und werden daher als Modellwerte dokumentiert.

## Transporthafen und Inselverbindungen

Der Transporthafen besitzt sechs Arbeitsplätze, erfüllt aber eine andere Aufgabe als das normale Transportbüro.

Für den ersten Ausbau:

- normales Transportbüro bedient allgemeine Landtransporte
- Transporthafen wird separat als Inselverbindungs-Infrastruktur gezählt
- keine gemeinsame Kapazität ohne bestätigte Lade- und Fahrtenwerte
- interinsulare Warenflüsse können als eigene Frachtklasse erscheinen

Später möglich:

- getrennte Kapazitätsparameter für Land- und Wassertransport
- Zuordnung von Warenströmen zu Inseln
- notwendige Anlegestellen und Transporthäfen

## Hafen

Der Hafen wird im ersten Modell als Endpunkt betrachtet:

- Exportmengen erzeugen eine Transportetappe zum Hafen
- Importe erzeugen eine Transportetappe vom Hafen zum Ziel
- Hafenarbeiter werden in der Arbeitskräftebilanz berücksichtigt
- eine eigene Umschlagkapazität wird mangels belastbarer Rate nicht berechnet

## Lagerhaus

Das Lagerhaus erhält zunächst keine erfundene Durchsatzleistung.

Berechenbar sind:

- Anzahl
- Baukosten
- Straßenbedarf
- zugewiesene Waren
- optional geplante Ein- und Auslagerungsmengen

Nicht berechenbar ohne zusätzliche Daten:

- Waren pro Monat
- zusätzliche Fahrten
- Zeitersparnis
- optimale Anzahl

## Handelsposten und Leuchtturm

Beide Gebäude können statisch erfasst werden. Handels- oder Schiffsmodifikatoren werden erst berechnet, wenn ihre Wirkungen vollständig als strukturierte Daten vorliegen. Sie erhöhen nicht pauschal die Transportbüro-Kapazität.

## Typische Diagnosen

### Produktion größer als Transportkapazität

- Titel: `Transportkapazität theoretisch zu niedrig`
- Detail: Differenz in Warenbestands-Einheiten pro Monat
- Handlung: zusätzliche Transportbüros oder Modellannahmen prüfen

### Keine Transportbüros bei Frachtvolumen

- Titel: `Frachtvolumen ohne erfasste Transportkapazität`
- Handlung: Transportbüro hinzufügen

### Unbekannte Produktionsrate

- Frachtvolumen ist unvollständig
- Transportempfehlung erhält Status `unvollständig`
- fehlende Gebäude und Arbeitsmodi werden aufgelistet

### Hoher lokaler Nahrungsverbrauch

- direkt konsumierte Nahrung reduziert den modellierten Transportbedarf
- der lokale Anteil muss als Annahme sichtbar sein

## Tooltip-Anforderung

Der Tooltip zeigt:

- berechnete Monatsfracht
- berücksichtigte Warenströme
- nicht transportierte lokale Mengen
- bestehende Büros
- Arbeiterstellen und Besetzung
- Effizienz
- Ladung je Fahrt
- Fahrten je Arbeiter-Arbeitstag
- theoretische Arbeitstage je Monat
- Arbeitsmodusfaktor
- Formel und Zwischenergebnisse
- Hinweis auf nicht berücksichtigte Wege, Staus, Rückfahrten und Bedürfnisse

## Vertrauensanzeige

Das Transportmodul zeigt zwei Badges:

- `Frachtvolumen: abgeleitet`
- `Bürobedarf: Modell`

Sind Produktionsraten unbekannt, lautet der erste Badge:

- `Frachtvolumen: unvollständig`

## Bewusst nicht ableitbar

- exakte reale Fahrtenzahl
- optimale Standorte
- tatsächliche Route
- Verkehrsbelastung
- Leerfahrten
- Prioritäten der Teamster-KI
- reale Spitzenlast
- genaue Leistung von Hafen und Transporthafen
