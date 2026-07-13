# Wohnmodell Kolonialzeit

Stand: 13. Juli 2026

## Ziel

Das Wohnmodul deckt zunächst nur sicher oder klar ableitbare Werte ab:

- Haushaltskapazität
- Wohnqualität
- Mindestwohlstand
- Bauplankosten
- Baukosten
- Arbeitsmodi mit eindeutigem Einfluss auf diese Werte

Nicht Teil dieser ersten Ausbaustufe ist eine automatische Empfehlung, wie viele Wohngebäude gebaut werden sollten.

## Warum Haushalte statt Einwohner

Wohngebäude besitzen im Spiel Haushaltsplätze. Eine belastbare feste Haushaltsgröße ist nicht dokumentiert und schwankt durch Familienzusammensetzung.

Deshalb gilt:

- Primäre Kapazitätseinheit: Haushalte
- Einwohnerkapazität wird nicht aus Haushalten hochgerechnet.
- Eine eingegebene Einwohnerzahl wird nicht automatisch in benötigte Wohnungen umgewandelt.
- Später kann eine beobachtete Haushaltszahl als separate Eingabe ergänzt werden.

## Koloniale Wohngebäude

| Gebäude | DLC | Bauplan | Baukosten | Haushalte | Wohnqualität | Mindestwohlstand |
|---|---|---:|---:|---:|---:|---|
| Hütte | automatisch | – | nicht baubar | 1 | 10 | pleite |
| Landhaus | Grundspiel | – | 850 $ | 2 | 48 | wohlhabend |
| Baracke | Grundspiel | – | 1.200 $ | 6 | 32 | arm |
| Villa | Grundspiel | Quellenkonflikt | 1.200 $ | 2 | 68 | reich |
| Wohnboot | Tropican Shores | 1.000 $ laut Einzelseite | 1.300 $ | 5 | 35 | arm |
| Baumhaus | Return to Nature | 1.000 $ laut Einzelseite | 1.100 $ | 5 | 30 | arm |

## Quellenkonflikte

Bei einzelnen Bauplankosten widersprechen sich die vollständige Gebäudetabelle und Einzelseiten.

Beispiele:

- Villa: Gesamttabelle nennt 500 $, Einzelseite nennt einen abweichenden Wert.
- Wohnboot und Baumhaus: Einzelseiten nennen jeweils 1.000 $.

Datenmodell und UI müssen deshalb unterstützen:

- primärer Wert
- alternativer Quellenwert
- Quellenstatus
- Hinweis im Tooltip

Ein widersprüchlicher Wert wird nicht stillschweigend als exakt behandelt.

## Arbeitsmodi

### Landhaus

#### Standard

- zwei Haushalte
- Wohnqualität 48 als Grundwert
- mindestens wohlhabend

#### Little Eden

- laufende Kosten plus 50 Prozent
- Wohnqualität plus 12
- längere Erholungszeit

Für den ersten Umfang werden Kosten- und Qualitätsänderung berücksichtigt. Die Erholungszeit wird nur als Beschreibung gespeichert.

### Baracke

#### Standard

- sechs Haushalte
- Wohnqualität 32
- mindestens arm

#### Stack Them Higher

- plus zwei Haushalte
- damit acht Haushalte
- akzeptiert Pleite-Haushalte
- keine Miete

Dieser Modus kann vollständig in Kapazität und Mindestwohlstand abgebildet werden.

### Villa

#### Standard

- zwei Haushalte
- Wohnqualität 68
- mindestens reich

#### Upper Upper Class

- mindestens stinkreich
- erhöhte Miete

Die Haushaltszahl bleibt unverändert. Die genaue Mietänderung wird nur gespeichert, wenn ein belastbarer Wert vorliegt.

### Wohnboot

#### Standard

- fünf Haushalte
- Wohnqualität 35
- mindestens arm

#### Collect Flotsam

- akzeptiert Pleite-Haushalte
- keine Miete

### Baumhaus

#### Standard

- fünf Haushalte
- Wohnqualität 30
- mindestens arm

#### Waldmodus

- Wohnqualität zunächst minus 20
- plus 5 je angrenzendem Baumhaus bei Basiseffizienz

Formel:

```text
treeHouseQuality =
  baseQuality
  - 20
  + 5 × adjacentTreeHouses
```

Da keine Karte modelliert wird, ist `adjacentTreeHouses` eine manuelle Eingabe oder später eine Clusterannahme.

Eine Verbesserung mit zusätzlichen Haushalten wird nicht berücksichtigt, wenn sie erst in den Weltkriegen verfügbar ist.

## Berechnung je Gebäudeeintrag

### Haushaltskapazität

```text
householdCapacity =
  count × householdsPerBuildingAfterMode
```

### Baukosten

```text
constructionCostTotal =
  count × constructionCostPerBuilding
```

### Bauplankosten

Bauplankosten werden nicht pro Gebäude multipliziert, wenn der Bauplan nur einmal freigeschaltet werden muss.

```text
blueprintCostRequired =
  buildingAlreadyUnlocked ? 0 : blueprintCost
```

Die Oberfläche trennt:

- einmalige Bauplankosten
- Baukosten für die eingetragene Anzahl
- Gesamtkosten des erstmaligen Aufbaus

### Gewichtete Wohnqualität

Für eine Gesamtübersicht kann die Wohnqualität nach Haushaltsplätzen gewichtet werden:

```text
weightedHousingQuality =
  Summe(quality × householdCapacity)
  / Summe(householdCapacity)
```

Dieser Wert beschreibt das vorhandene Wohnangebot, nicht die tatsächliche Wohnzufriedenheit der Einwohner.

## Kapazität nach Wohlstand

Wohnplätze werden nach Mindestwohlstand gruppiert:

- pleite
- arm
- wohlhabend
- reich
- stinkreich

Ausgabe:

```text
capacityByMinimumWealth[wealth] =
  Summe aller Haushaltsplätze mit diesem Mindestwohlstand
```

Zusätzlich kann kumulativ angezeigt werden, welche Haushalte ein Gebäude theoretisch nutzen können. Dabei muss die Wohlstandslogik des Spiels korrekt abgebildet werden: Ein reicher Haushalt kann grundsätzlich auch ein Gebäude mit niedrigerem Mindestwohlstand nutzen, sofern keine gegenteilige Arbeitsmodusregel besteht.

## Hütten

Hütten sind nicht regulär baubar. Sie werden von obdachlosen Haushalten automatisch errichtet.

Im Modell:

- separat von geplanten Wohngebäuden
- Anzahl kann manuell eingetragen werden
- ein Haushalt je Hütte
- Wohnqualität 10
- Mindestwohlstand pleite
- keine Baukosten
- nicht in der Gebäudeauswahl für `Gebäude hinzufügen`, außer über eine Option `automatisch entstandene Gebäude erfassen`

## Wohnübersicht

Die erste Wohnübersicht zeigt:

- gesamte Haushaltskapazität
- Kapazität nach Mindestwohlstand
- Anzahl Hütten
- gewichtete Wohnqualität
- gesamte Baukosten des erfassten Wohnbestands
- noch notwendige Bauplankosten für geplante Gebäude
- DLC-Anteil der Wohnkapazität
- Gebäude mit Quellenkonflikt

## Mögliche optionale Ist-Daten

Ohne automatische Empfehlung können Nutzer später zusätzlich eintragen:

- belegte Haushalte
- freie Haushaltsplätze
- obdachlose Haushalte

Dann sind folgende rein arithmetische Werte möglich:

```text
vacantHouseholdCapacity =
  totalHouseholdCapacity - occupiedHouseholds
```

Diese Eingabe ist optional und nicht aus der Einwohnerzahl abzuleiten.

## Zusammenhang mit Produktion und Logistik

Wohngebäude erzeugen im ersten Modell:

- keine Warenproduktion
- keinen theoretischen Warenverkehr
- keine automatische Produktivitätsänderung

Arbeitswege werden ausdrücklich nicht berücksichtigt. Das Wohnmodul bleibt daher fachlich getrennt von Produktion und Transport.

## DLC-Verhalten

- Wohnboot erscheint nur bei aktivem Tropican Shores.
- Baumhaus erscheint nur bei aktivem Return to Nature.
- Bereits vorhandene Einträge bleiben sichtbar, wenn ein DLC später deaktiviert wird.
- Solche Einträge erhalten den Status `DLC deaktiviert` und sind nicht neu auswählbar.

## UI-Anforderung

In der Gebäudetabelle unterscheiden sich Wohnzeilen von Produktionszeilen:

- Anzahl
- Arbeitsmodus
- Haushaltsplätze
- Wohnqualität
- Mindestwohlstand
- Kosten

Effizienz wird nur angezeigt, wenn sie für den gewählten Wohnmodus tatsächlich eine dokumentierte Wirkung besitzt. Ein bedeutungsloses Effizienzfeld soll nicht aus Gründen der Tabellenvereinheitlichung gezeigt werden.

## Bewusst nicht berechnet

- benötigte Gebäude aus Einwohnerzahl
- durchschnittliche Haushaltsgröße
- Pendelwege
- Mieten und Einnahmen ohne vollständige Budgetdaten
- Wohnzufriedenheit einzelner Einwohner
- optimale Platzierung
- Einfluss auf Arbeitsanwesenheit
- automatische Abriss- oder Bauempfehlung
