# Prüf- und Teststrategie

Stand: 13. Juli 2026

## Ziel

Die spätere Umsetzung muss nicht nur technisch funktionieren, sondern fachlich nachweisen, dass Einheiten, Monatsumrechnung, Produktionsketten, Nahrung, Wohnen und Logistik konsistent sind.

## Testebenen

- Stammdatenvalidierung
- reine Formeltests
- Kettenberechnung
- Szenariobilanz
- UI-Komponententests
- Persistenz und Migration
- manuelle Bedienprüfung
- spätere Vergleichsmessung im Spiel

## Stammdatenvalidierung

Automatische Prüfungen beim Build:

- jede ID ist eindeutig
- jedes Gebäude verweist auf vorhandenes DLC
- jede Variante verweist auf vorhandenes Stammgebäude
- jedes Rezept verweist auf vorhandene Waren
- jeder Arbeitsmodus besitzt eine gültige Freischaltära
- Arbeitsmodus ist nicht vor dem Gebäude verfügbar
- jede Nahrungsware ist korrekt als `food` klassifiziert
- jedes Wohngebäude besitzt Haushalte, Qualität und Mindestwohlstand
- unbekannte Werte sind `null`
- kein unbekannter Wert wird als `0` gespeichert
- Modellwerte besitzen nicht den Status `verified`
- Quellenkonflikte besitzen mindestens zwei Quellenangaben
- Produktionsstufen enthalten keine Zyklen

## Einheitentests

### Skalierung der Messwerte

Eingabe:

```text
Rate = 1,5
Skalierung = 1.000
```

Erwartung:

```text
1.500 Warenbestands-Einheiten je Arbeiter-Arbeitstag
```

### Zuckerplantage pro Monat

Eingabe:

- ein Gebäude
- acht Arbeiterstellen
- Rate 1,5
- 100 Prozent Effizienz
- 100 Prozent Besetzung
- 30 theoretische Arbeitstage

Erwartung:

```text
1 × 8 × 1,5 × 1.000 × 1 × 1 × 30
= 360.000 Zucker pro Monat
```

### Fünf Zuckerplantagen

Erwartung:

```text
5 × 360.000 = 1.800.000 Zucker pro Monat
```

### Besetzung

Eingabe wie eine Zuckerplantage, aber 50 Prozent Besetzung.

Erwartung:

- maximale Kapazität: 360.000
- konfigurierte theoretische Leistung: 180.000

### Effizienz

Eingabe wie eine Zuckerplantage, aber 125 Prozent Effizienz.

Erwartung:

```text
360.000 × 1,25 = 450.000
```

## Kettentest Zucker zu Rum

### Eine Rumdestillerie im Dunder-Modus

Eingabe:

- vier Arbeiter
- Zuckerbedarf 5,1 je Arbeiter-Arbeitstag
- Rumproduktion 3,5 je Arbeiter-Arbeitstag
- 30 Arbeitstage

Erwarteter Zuckerbedarf:

```text
4 × 5,1 × 1.000 × 30
= 612.000 Zucker pro Monat
```

Erwartete Rumproduktion:

```text
4 × 3,5 × 1.000 × 30
= 420.000 Rum pro Monat
```

Benötigte Zuckerplantagen:

```text
612.000 / 360.000 = 1,7
```

Erwartung:

- rechnerisch: 1,7 Zuckerplantagen
- empfohlen: 2 Zuckerplantagen
- Zuckerproduktion: 720.000
- Reserve: 108.000 Zucker

## Kettentest Holz zu Papier zu Bücher

Testziel:

- eine vollständig ausgelastete Druckerei
- Arbeitsmodus Papierausgabe

Prüfung:

- Papierbedarf korrekt berechnen
- geeigneten Papiermühlenmodus verwenden
- Papiermühlenbedarf aufrunden
- vorgelagerten Rohstoffbedarf berechnen
- keine zyklische Abhängigkeit
- Return to Nature muss aktiv sein

Variantenprüfung:

- Holz
- Kokosnüsse
- Baumwolle
- Wolle

## Gemeinsame Rohstoffverteilung

Szenario:

- Holzstämme werden von Sägewerk und Papiermühle benötigt.
- verfügbare Menge reicht nur für 75 Prozent des Gesamtbedarfs.

Standarderwartung:

- proportionale Zuteilung
- beide Verbraucher erhalten 75 Prozent
- kein Ergebnis hängt von der Reihenfolge der Einträge ab

Prioritätserwartung:

- priorisiertes Sägewerk wird zuerst versorgt
- Rest geht an Papiermühle
- Priorität wird in der Ergebnisbegründung genannt

## Logistiktests

### Referenzbüro pro Monat

Eingabe:

- ein Transportbüro
- sechs Arbeiter
- 100 Prozent Besetzung
- 100 Prozent Effizienz
- 500 Einheiten Ladung
- zwei Fahrten je Arbeitstag
- 30 Arbeitstage
- sichere Ladung

Erwartung:

```text
1 × 6 × 1 × 1 × 500 × 2 × 30 × 1
= 180.000 Einheiten pro Monat
```

### Rumkette mit zwei Zuckerplantagen

Annahme:

- 720.000 Zucker werden produziert.
- 612.000 Zucker gehen zur Destillerie.
- 108.000 Zucker werden exportiert.
- 420.000 Rum werden exportiert.

Frachtvolumen:

```text
612.000 Zucker zur Destillerie
+ 108.000 Zucker zum Hafen
+ 420.000 Rum zum Hafen
= 1.140.000 Einheiten
```

Bei 180.000 Kapazität je Büro:

```text
ceil(1.140.000 / 180.000) = 7 Büros
```

Prüfung:

- Zucker wird nicht zusätzlich als Fabrikeingang doppelt gezählt.
- Rum ist eine eigene Etappe und wird gezählt.
- bei sechs Büros entsteht ein Defizit von 60.000 Einheiten.

### Lokaler Nahrungsverbrauch

Szenario:

- 100.000 Bananen verfügbar
- 25 Prozent lokaler Verbrauch
- Rest zum Lebensmittelladen

Erwartung:

- 25.000 ohne Transport
- 75.000 Transportbedarf

### Unbekannte Produktionsrate

Szenario enthält Kokosnussernter ohne Rate.

Erwartung:

- Frachtvolumen `unvollständig`
- keine Kokosmenge als null addieren
- betroffenes Gebäude wird benannt

## Nahrungstests

### Nahrungsarten

Testmenge:

- Bananen
- Zucker
- Fleisch
- Kaffee
- Milch

Erwartung:

- Nahrung: Bananen, Fleisch, Milch
- keine Nahrung: Zucker, Kaffee
- Vielfalt: 3

### Produktionsmenge Bananen

Eine Bananenplantage bei 100 Prozent, voller Besetzung und 30 Tagen:

```text
1 × 8 × 2,5 × 1.000 × 30
= 600.000 Bananen
```

### Bedarf ohne Kalibrierwert

Eingabe:

- 500 Einwohner
- kein `foodNeedPerResidentPerMonth`

Erwartung:

- Produktion sichtbar
- Nahrung pro Einwohner sichtbar
- Vielfalt sichtbar
- Bedarf, Deckungsgrad und Fehlmenge `nicht kalibriert`
- keine Prozentzahl wird erfunden

### Bedarf mit Kalibrierwert

Eingabe:

- 500 Einwohner
- Modellbedarf 1.000 Einheiten pro Einwohner und Monat
- Sicherheitsreserve 10 Prozent

Erwartung:

```text
500 × 1.000 × 1,10 = 550.000
```

Bei 600.000 verfügbaren Bananen:

- Reserve: 50.000
- Deckung: ungefähr 109,1 Prozent

### Nahrungsvielfalt mit unbekannter Rate

Szenario:

- Bananenplantage mit bekannter Rate
- Kokosnussernter mit unbekannter Rate

Erwartung:

- Produktionsvielfalt: 2
- Gesamtmenge: unvollständig
- Kokosnüsse werden nicht aus der Vielfalt entfernt

## Lebensmittelladen-Tests

- ein Laden ergibt 16 Besucherplätze
- zwei Läden ergeben 32 Besucherplätze
- daraus wird keine Einwohnerkapazität pro Monat berechnet
- Grund-Servicequalität 45 wird angezeigt
- Vielfaltseinfluss bleibt ohne Formel qualitativ

## Wohntests

### Standardkapazität

Szenario:

- zwei Baracken im Standardmodus

Erwartung:

```text
2 × 6 = 12 Haushaltsplätze
```

### Stack Them Higher

Szenario:

- zwei Baracken im entsprechenden Modus

Erwartung:

```text
2 × 8 = 16 Haushaltsplätze
```

Mindestwohlstand:

- pleite

### Baukosten

Zwei Baracken:

```text
2 × 1.200 = 2.400 $
```

### Bauplankosten

Drei Villen, Bauplan noch nicht freigeschaltet:

Erwartung:

- Bauplan einmal
- Baukosten dreimal
- Quellenkonflikt des Bauplans sichtbar

### Gewichtete Wohnqualität

Szenario:

- eine Baracke: 6 Plätze, Qualität 32
- ein Landhaus: 2 Plätze, Qualität 48

Erwartung:

```text
(6 × 32 + 2 × 48) / 8 = 36
```

### Hütte

- ein Haushalt
- Qualität 10
- keine Baukosten
- nicht über normale Bauauswahl hinzufügbar

## DLC-Tests

### Deaktiviertes DLC

- Return to Nature deaktiviert
- Papiermühle nicht neu auswählbar
- vorhandene Papiermühle bleibt sichtbar
- Eintrag erhält Warnstatus
- Zielberechnung darf Papiermühle nicht automatisch neu vorschlagen

### Aktiviertes DLC

- Return to Nature aktiviert
- Papiermühle, Druckerei, Köhlerei, Imkerei, Baumhaus und zugehörige Modi erscheinen

### Grundspiel

- `base` kann nicht deaktiviert werden

## Ära-Tests

- Kolonialzeit aktiv
- koloniale Gebäude auswählbar
- Weltkriegsgebäude je Einstellung deaktiviert sichtbar oder ausgeblendet
- Weltkriegs-Arbeitsmodus eines kolonialen Gebäudes nicht auswählbar
- Wechsel der Projektära verändert keine gespeicherten Gebäudeeinträge

## Suchauswahl-Tests

- Suche `zucker` findet Zuckerplantage, Imkerei und Rumdestillerie
- Suche `rum` findet Rumdestillerie
- Suche `return` findet aktive Return-to-Nature-Gebäude
- deaktiviertes DLC liefert keine auswählbaren Treffer
- Pfeiltasten verändern aktive Option
- Enter wählt
- Escape schließt
- Fokus kehrt zum Auslöser zurück
- aktuelle nicht verfügbare Auswahl bleibt sichtbar

## Kaskadenauswahl-Tests

Desktop:

- Klick öffnet Ären
- Hover öffnet Kategorie mit Verzögerung
- Pfeil rechts öffnet Untermenü
- Pfeil links schließt Untermenü
- deaktivierte Ära kann nicht geöffnet werden
- Klick fixiert Ebene
- Bewegung zum rechten Menü schließt die linke Ebene nicht

Mobil:

- Öffnen zeigt Ärenliste
- Auswahl der Ära zeigt Kategorien
- Auswahl der Kategorie zeigt Gebäude
- Zurück geht eine Ebene zurück
- Schließen stellt Fokus wieder her

## Persistenztests

Aus Schema 2 laden:

- fehlende Picker-Einstellung wird `search`
- fehlende Monatsarbeitstage erhalten Modellstandard
- bestehende DLC-Liste bleibt erhalten
- bestehende Einträge bleiben unverändert
- alte Rateüberschreibungen werden korrekt skaliert oder mit Migrationshinweis versehen

Der letzte Punkt benötigt besondere Aufmerksamkeit: Bereits gespeicherte manuelle Werte können in alter Einheit vorliegen. Eine automatische Multiplikation ist nur sicher, wenn Herkunft und Schema eindeutig sind.

## Snapshot- und Regressionsfälle

Mindestens folgende feste Szenarien im Testbestand:

- leere Insel
- eine Zuckerplantage
- vollständige Rumkette
- Holz zu Bretter
- Rinder zu Leder
- Return-to-Nature-Bücherkette
- Nahrung ohne Bedarfsmodell
- Nahrung mit Bedarfsmodell
- Wohnen Grundspiel
- Wohnen mit DLC
- deaktiviertes DLC mit vorhandenem Eintrag
- Produktionsgebäude mit unbekannter Rate

## Manuelle visuelle Prüfung

Desktop:

- 1280 Pixel
- 1024 Pixel
- 768 Pixel

Mobil:

- ungefähr 390 Pixel
- ungefähr 360 Pixel

Prüfpunkte:

- Tabellenzeile bleibt kompakt
- Picker wird nicht vom Scrollcontainer abgeschnitten
- kein seitliches Menü verlässt unkontrolliert den Viewport
- Suchfeld bleibt sichtbar
- lange deutsche Namen werden sinnvoll gekürzt
- DLC- und Datenstatus bleiben lesbar
- Fokus ist sichtbar
- deaktivierte Einträge sind unterscheidbar

## Spielvergleich

Nach technischer Umsetzung muss ein kontrollierter Vergleich erfolgen:

- identische Gebäudeanzahl
- identischer Arbeitsmodus
- 100 Prozent Effizienz
- volle Besetzung
- Lagerstände zu Beginn und Ende
- Arbeiterbesuche zählen
- theoretische Rate je Besuch mit Spieländerung vergleichen

Das Monatsmodell wird nicht gegen reale Monate geprüft, solange Wege und Anwesenheit ausdrücklich ausgeschlossen sind. Geprüft wird die korrekte Umrechnung aus der gewählten Modellannahme.

## Abbruchkriterien

Eine Veröffentlichung der erweiterten Berechnung ist nicht akzeptabel, wenn:

- Produktions- und Transporteinheiten nicht übereinstimmen
- unbekannte Werte als null behandelt werden
- spätere Arbeitsmodi in der Kolonialzeit auswählbar sind
- Bedarfsdeckung ohne Nahrungsmodellwert erscheint
- Bauplankosten pro Gebäude multipliziert werden
- DLC-Deaktivierung Einträge löscht
- Kaskadenmenü nur per Hover bedienbar ist
- Fokus nach Schließen verloren geht
