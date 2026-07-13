# Nahrungsmodell Kolonialzeit

Stand: 13. Juli 2026

## Ziel

Das Nahrungsmodul soll für den kolonialen Inselstand zeigen:

- theoretisch produzierte Nahrungsmenge pro Monat
- für Nahrung verfügbare Menge nach Industrie und Reserven
- theoretischer Nahrungsbedarf der eingetragenen Bevölkerung
- Deckungsgrad und Fehlmenge
- vorhandene Nahrungsvielfalt
- Verteilung über Lebensmittelläden
- Datenqualität und Modellannahmen

## Koloniale Nahrungswaren

Die Warentabelle kennzeichnet in der Kolonialzeit folgende Rohwaren ausdrücklich als Nahrung:

- Bananen
- Kokosnüsse
- Mais
- Fisch
- Fleisch
- Milch
- Ananas
- Schalentiere

Nicht als Nahrung klassifiziert sind unter anderem:

- Zucker
- Kakao
- Kaffee
- Baumwolle
- Kautschuk
- Tabak
- Wolle
- Häute
- Leder
- Perlen

Damit darf eine hohe Zucker- oder Kakaoproduktion nicht die Nahrungsversorgung erhöhen.

## Nahrungsquellen

| Nahrung | Koloniale Quelle |
|---|---|
| Bananen | Bananenplantage |
| Kokosnüsse | Kokosnussernter |
| Mais | Maisplantage |
| Fisch | Fischereihafen im Fischmodus |
| Fleisch | Rinder- oder Schweinefarm |
| Milch | Schaf- oder Ziegenfarm |
| Ananas | Ananasplantage |
| Schalentiere | Fischereihafen im Schalentiermodus |

Rinder und Schafe erzeugen zusätzlich Nicht-Nahrungswaren. Die Nahrungsmenge darf daher nicht aus dem Gesamtoutput der Ranch abgeleitet werden, sondern nur aus dem als Nahrung klassifizierten Ausgang.

## Monatliche Nahrungsproduktion

Für jede Nahrungsware gilt dieselbe Produktionsformel wie im Produktionsmodell:

```text
foodProductionMonthly[good] =
  count
  × workerSlots
  × ratePerWorkerWorkday
  × 1.000
  × efficiencyRate
  × staffingRate
  × theoreticalWorkdaysPerMonth
```

Für Kokosnüsse, Fisch und Schalentiere bleibt die Menge unbekannt, bis belastbare Raten vorliegen. Das Modul zeigt diese Waren trotzdem als vorhandene Vielfalt, wenn entsprechende Gebäude existieren, kennzeichnet die Gesamtmenge aber als unvollständig.

## Verfügbare Nahrungsmenge

Eine essbare Ware kann auch anderweitig genutzt werden. In der Kolonialzeit betrifft das besonders:

- Kokosnüsse für Papier und Feuerwerk
- Mais für Feuerwerk

Deshalb gilt:

```text
availableFoodMonthly[good] =
  foodProductionMonthly[good]
  + foodImportsMonthly[good]
  - industryAllocationMonthly[good]
  - protectedReserveMonthly[good]
  - plannedExportMonthly[good]
```

Negative Ergebnisse werden als Fehlzuweisung angezeigt und für die Versorgung auf null begrenzt.

## Lokaler Konsum und Lebensmittelladen

Nahrung kann laut Warendokumentation direkt am Produktionsgebäude konsumiert werden, sofern lokaler Konsum nicht deaktiviert ist. Sie kann außerdem über den Lebensmittelladen verteilt werden.

Das Modell trennt:

- `localFoodAmount`
- `groceryFoodAmount`
- `unassignedFoodAmount`

Vereinfachte Einstellung:

- Anteil lokaler Verbrauch von 0 bis 100 Prozent
- Restmenge für Lebensmittelläden

Formeln:

```text
localFoodAmount = availableFoodMonthly × localConsumptionShare
```

```text
groceryFoodAmount = availableFoodMonthly - localFoodAmount
```

Der lokale Anteil reduziert den theoretischen Transportbedarf. Er sagt nicht aus, ob die Bevölkerung tatsächlich nah genug an den Erzeugern wohnt.

## Theoretischer Nahrungsbedarf

### Datenlage

Eine belastbare öffentliche Quelle für den exakten Warenverbrauch eines Einwohners pro Monat wurde nicht gefunden. Die Besucherplätze des Lebensmittelladens liefern ebenfalls keine Monatsmenge, weil Besuchsdauer, Besuchshäufigkeit und Haushaltsgröße fehlen.

Ein fester Verbrauchswert darf deshalb nicht als bestätigte Spielkonstante gespeichert werden.

### Empfohlenes Modell

Der Bedarf wird über einen sichtbaren Kalibrierwert berechnet:

- `population`
- `foodNeedPerResidentPerMonth`
- optional `foodSafetyReservePercent`

```text
baseFoodDemandMonthly =
  population × foodNeedPerResidentPerMonth
```

```text
targetFoodDemandMonthly =
  baseFoodDemandMonthly
  × (1 + foodSafetyReservePercent / 100)
```

Der Kalibrierwert erhält den Status `model` und wird in den Einstellungen erklärt.

### Verhalten ohne Kalibrierwert

Solange kein Modellwert gewählt wurde, zeigt die Anwendung:

- verfügbare Nahrungsmenge pro Einwohner
- Nahrungsproduktion
- Vielfalt
- Lebensmittelladenplätze
- Hinweis `Bedarfswert noch nicht kalibriert`

Sie zeigt keine erfundene prozentuale Bedarfsdeckung.

### Spätere Kalibrierung

Ein belastbarer Standardwert kann später aus kontrollierten Spieltests abgeleitet werden:

- feste Einwohnerzahl
- kein Bevölkerungswachstum
- definierter Anfangsbestand einer Nahrung
- keine Produktion und kein Export
- lokaler Konsum kontrolliert
- Bestandsänderung über mehrere Spielmonate
- mehrere Wiederholungen

Bis zu einer solchen Messung bleibt der Parameter bewusst konfigurierbar.

## Deckungsgrad

Wenn ein Bedarfswert vorhanden ist:

```text
foodCoverage =
  totalAvailableFoodMonthly / targetFoodDemandMonthly
```

```text
foodDifference =
  totalAvailableFoodMonthly - targetFoodDemandMonthly
```

Statusvorschlag:

- mindestens 120 Prozent: deutliche Reserve
- 100 bis unter 120 Prozent: ausreichend
- 85 bis unter 100 Prozent: knapp
- unter 85 Prozent: Mangel

Die Schwellen sind Produktregeln und keine Spielkonstanten.

## Nahrungsvielfalt

### Sicher berechenbar

Die Inselvielfalt ist die Anzahl unterschiedlicher essbarer Waren mit positiver verfügbarer Menge:

```text
islandFoodVariety = count(
  availableFoodMonthly[good] > minimumVarietyAmount
)
```

Der Mindestwert verhindert, dass eine vernachlässigbare Restmenge als dauerhafte Vielfalt zählt. Er ist konfigurierbar oder wird als kleiner Anteil des Monatsbedarfs definiert.

### Drei unterschiedliche Vielfaltsebenen

- Produktionsvielfalt: Nahrung wird auf der Insel erzeugt.
- verfügbare Vielfalt: Nahrung bleibt nach Industrie, Export und Reserve verfügbar.
- Ladenvielfalt: Nahrung ist einem Lebensmittelladen oder dem gemeinsamen Verteilungspool zugewiesen.

Diese Werte dürfen nicht vermischt werden.

### Vielfaltanzeige

Für jede der acht kolonialen Nahrungswaren:

- vorhanden
- produziert, Rate bekannt
- produziert, Rate unbekannt
- importiert
- vollständig industriell gebunden
- exportiert
- nicht vorhanden

Zusammenfassung:

- `5 von 8 Nahrungsarten verfügbar`
- Liste fehlender Arten
- Liste nur durch Import verfügbarer Arten

## Vielfalt und Lebensmittelladenqualität

Die Gebäudeseite des Lebensmittelladens bestätigt, dass Effizienz und lokale Nahrungsvielfalt die Servicequalität skalieren. Eine exakte Formel für den Beitrag je Nahrungsart ist dort nicht angegeben.

Daher gilt zunächst:

- Grund-Servicequalität 45 wird angezeigt.
- Effizienz kann als bekannter allgemeiner Faktor berücksichtigt werden, sofern die Spielmechanik bestätigt ist.
- Vielfalt wird als positiver qualitativer Einfluss angezeigt.
- Es wird keine exakte Servicequalität aus der Anzahl der Warenarten erfunden.

Spätere Datenextraktion oder Spielmessung kann eine Formel ergänzen.

## Lebensmittelladen

Belastbare Grunddaten:

- Baukosten: 1.200 $
- vier ungelernte Arbeitsplätze
- 16 Besucherplätze
- Grund-Servicequalität: 45
- erforderlicher Wohlstand: arm
- verkauft Nahrung an den Haushalt des Besuchers
- verkauft zusätzlich Konsumgüter

## Was aus 16 Besucherplätzen nicht abgeleitet werden darf

Ohne weitere Daten sind nicht exakt berechenbar:

- versorgte Einwohner pro Monat
- versorgte Haushalte pro Monat
- notwendige Lebensmittelläden je 100 Einwohner
- Warendurchsatz je Monat
- durchschnittliche Wartezeit

Die Anwendung kann deshalb zunächst nur anzeigen:

- vorhandene Läden
- insgesamt 16 Besucherplätze je Laden
- theoretische Nahrungsmenge im Verteilungspool
- Warnung, dass Besucherdurchsatz nicht modelliert wird

## Nahrung und Logistik

- lokal konsumierte Ware erzeugt keinen modellierten Transport
- einem Lebensmittelladen zugewiesene Ware erzeugt eine Transportetappe
- importierte Nahrung erzeugt eine Etappe vom Hafen zum Verteilungspool
- exportierte Nahrung erzeugt eine Etappe zum Hafen
- dieselbe Warenmenge darf nur einer Verwendung zugeordnet werden

## Nahrung und Produktionsketten

Nahrungswaren bleiben normale Waren in der Warenbilanz. Das Nahrungsmodul ist eine fachliche Sicht auf dieselben Daten.

Dadurch werden vermieden:

- doppelte Produktionsberechnung
- getrennte Lagerbestände
- Widersprüche zwischen Produktions- und Nahrungsansicht

## Eingaben im einfachen Modus

- Einwohnerzahl
- Gebäudeanzahl und Effizienz
- optional Besetzung
- lokaler Nahrungsanteil
- optionaler Modellbedarf je Einwohner und Monat
- Sicherheitsreserve

## Eingaben im erweiterten Modus

- Nahrungsreserve je Ware
- Industriepriorität je Ware
- Exportfreigabe
- Importmenge
- Zuordnung zu Lebensmittelläden
- Mindestmenge für Vielfalt

## Hauptausgaben

- Nahrung produziert pro Monat
- Nahrung verfügbar pro Monat
- Nahrung pro Einwohner
- theoretischer Bedarf, falls kalibriert
- Reserve oder Fehlmenge
- Vielfalt produziert
- Vielfalt verfügbar
- Vielfalt im Verteilungspool
- unbekannte Produktionsanteile
- benötigtes Transportvolumen für die Verteilung

## Beispielhinweise

- `Nahrungsbedarf nicht berechenbar: Verbrauch je Einwohner wurde noch nicht kalibriert.`
- `6 von 8 kolonialen Nahrungsarten sind verfügbar.`
- `Kokosnüsse sind vorhanden, die Produktionsmenge ist wegen fehlender Rate nicht vollständig berechenbar.`
- `Der gesamte Mais ist der Feuerwerksproduktion zugewiesen und steht nicht als Nahrung zur Verfügung.`
- `16 Besucherplätze je Lebensmittelladen sind erfasst; ein Monatsdurchsatz ist nicht belegt.`

## Bewusst nicht berechnet

- tatsächliche Hungerwahrscheinlichkeit einzelner Einwohner
- Laufwege zum Lebensmittelladen
- Haushaltsbesuche und Besuchsfrequenz
- genaue Servicequalitätssteigerung je Warenart
- Verderb
- reale Verteilung durch Teamster
