# Übertragbare Muster aus Anno- und Produktionsrechnern

Stand: 13. Juli 2026

## Ziel der Vergleichsrecherche

Der Tropico-Planer soll sich nicht optisch kopieren, sondern die bewährten Denkmodelle anderer Rechner übernehmen, die für Tropico tatsächlich passen.

Untersucht wurden insbesondere Muster aus:

- Anno-Bedarfsrechnern
- FactorioLab
- Satisfactory Calculator
- der bestehenden Tropico-Anwendung

## Kernunterschied zwischen Anno und Tropico

### Anno

Anno-Rechner können häufig von einer stabilen Einwohnerzahl und klar definierten Verbrauchsraten ausgehen. Daraus werden Produktionsgebäude rückwärts berechnet.

Typische Frage:

`Wie viele Bäckereien brauche ich für 5.000 Einwohner?`

### Tropico

Tropico verbindet:

- Produktionsgebäude
- einzelne Arbeiter
- Effizienz
- schwankende Anwesenheit
- Warenlager
- Transport
- freien Export
- Nahrungsverteilung
- Wohlstand und Wohnraum

Ein Tropico-Rechner darf deshalb nicht behaupten, jede reale Leistung exakt vorauszusagen.

Für den aktuellen Auftrag werden bewusst nur theoretische, klar berechenbare Ebenen verwendet.

## Übertragbares Muster 1: Ziel zuerst

Factorio- und Satisfactory-Rechner beginnen mit einer Zielware oder Zielmenge.

Für Tropico geeignet:

- Zielgebäude vollständig versorgen
- Zielmenge einer Ware pro Monat produzieren
- vorhandene Rohstoffproduktion prüfen
- maximale Endproduktion aus vorhandenen Quellen bestimmen

Beispiel:

```text
Ziel: 3 Rumdestillerien im Modus Dunder-Destille
```

Der Rechner löst rückwärts auf:

- Zuckerbedarf
- mögliche Zuckerquellen
- exakte Zahl Zuckerplantagen oder Imkereien
- aufgerundete Gebäudezahl
- Überschuss
- Arbeitsplätze
- Frachtvolumen

## Übertragbares Muster 2: Exakt und aufgerundet trennen

Produktionsrechner zeigen häufig einen mathematischen Bedarf wie 2,4 Gebäude. Im Spiel können nur ganze Gebäude gebaut werden.

Für Tropico sollen immer drei Werte erscheinen:

- rechnerisch benötigt
- empfohlen als ganze Gebäude
- Überschuss durch Aufrundung

Beispiel:

```text
2,4 Zuckerplantagen rechnerisch
3 Zuckerplantagen empfohlen
0,6 Plantagenleistung Reserve
```

## Übertragbares Muster 3: Eine Berechnung, mehrere Ansichten

Satisfactory-Rechner bieten unterschiedliche Sichten auf dasselbe Modell:

- Netzwerk
- Baum
- Waren
- Gebäude

Für Tropico geeignet:

- direkte Gebäudeliste
- Produktionskettenansicht
- Warenbilanz
- Zielplan
- Nahrungsansicht
- Wohnansicht

Alle Ansichten verwenden dieselben Berechnungsergebnisse. Es darf keine separate Logik pro Seite entstehen.

## Übertragbares Muster 4: Zeitbezogene Raten

Produktionsrechner verwenden eine feste Zeiteinheit wie pro Minute.

Für Tropico wird daraus:

- Standardanzeige pro theoretischem Monat
- Tooltip zusätzlich je Arbeiter-Arbeitstag
- sichtbarer Modellfaktor für Arbeitstage pro Monat

Damit bleibt die Anzeige verständlich, ohne die Messbasis zu verschweigen.

## Übertragbares Muster 5: Alternative Rezepte und Produzenten

FactorioLab behandelt alternative Rezepte als Teil derselben Warenbeziehung.

Für Tropico relevant:

- Sägewerk Normalbetrieb oder schnelles Entrinden
- Rumdestillerie Normalbetrieb oder Dunder-Destille
- Gerberei Normalbetrieb oder Chromgerbung
- Zuckerplantage oder Imkerei als Zuckerquelle
- Papiermühle mit verschiedenen Rohstoffen
- Druckerei mit oder ohne Ledereinband

Der Nutzer entscheidet, welche Quelle oder welcher Modus bevorzugt wird. Der Rechner darf keine DLC-Quelle versteckt erzwingen.

## Übertragbares Muster 6: Bewohnerbedarf als eigenes Modul

Anno trennt Produktionsketten und Einwohnerbedürfnisse.

Für Tropico geeignet:

- Produktion bleibt Warenmodell.
- Nahrung liest essbare Waren aus der Warenbilanz.
- Wohnen liest Haushaltsplätze aus Wohngebäuden.
- Nahrung und Wohnen erhalten eigene Zusammenfassungen.

Nicht geeignet wäre, jede Plantage direkt einer festen Einwohnerzahl zuzuordnen, solange der Nahrungsverbrauch nicht belastbar kalibriert ist.

## Übertragbares Muster 7: Einstellungen für Spielinhalt

Viele Rechner erlauben DLCs, alternative Gebäude oder Spielversionen zu filtern.

Für Tropico:

- Grundspiel immer aktiv
- DLCs einzeln aktivierbar
- Gebäudeauswahl filtert danach
- bestehende Einträge bleiben bei deaktiviertem DLC erhalten
- Berechnungen zeigen den deaktivierten Inhalt als Konflikt

## Übertragbares Muster 8: Datenwarnungen statt stiller Ersatzwerte

Ein Produktionsrechner wirkt nur dann vertrauenswürdig, wenn fehlende Daten sichtbar bleiben.

Für Tropico:

- unbekannte Rate blockiert die betroffene Teilrechnung
- Zielplan zeigt die fehlende Stufe
- Logistik meldet unvollständiges Frachtvolumen
- Nahrungsmodul meldet unvollständige Gesamtmenge
- Nutzerwerte werden separat gekennzeichnet

## Nicht übertragbares Muster 1: Vollständige deterministische Simulation

Factorio und Satisfactory besitzen stärker deterministische Maschinenraten. Tropico enthält Arbeiterverhalten und Transport-KI.

Deshalb nicht übernehmen:

- Aussage, dass reale Produktion exakt der theoretischen Rate entspricht
- exakte Fahrzeit aus bloßer Gebäudeanzahl
- exakte Teamster-Auslastung ohne Routen
- automatische optimale Stadtplanung

## Nicht übertragbares Muster 2: Netzwerkgraph als Hauptbedienung

Ein dynamischer Graph kann Ketten erklären, eignet sich aber nicht als Hauptweg für die tägliche Inselpflege.

Gründe:

- viele Gebäude ohne Produktionsrezept
- Nahrung und Wohnen sind keine linearen Ketten
- auf Mobilgeräten schwer bedienbar
- bestehende direkte Tabellenbearbeitung wäre versteckt

Der Graph bleibt optional für einen einzelnen Zielplan.

## Nicht übertragbares Muster 3: Ein riesiges technisches Formular

Viele Rechner zeigen sämtliche Faktoren gleichzeitig. Das widerspricht der begonnenen Linie.

Für Tropico gilt:

- Standardansicht zeigt Ergebnis und häufige Eingaben.
- Detail-Popover erklärt Formel und Datenquelle.
- Modellparameter liegen in den Einstellungen.
- erweiterte Warenverteilung erscheint nur bei Bedarf.

## Empfohlenes hybrides Bedienmodell

### Modus A: Meine Insel

Direkte Pflege des Bestands:

- Gebäude
- Anzahl
- Effizienz
- Besetzung
- Arbeitsmodus
- theoretische Leistung
- Warnungen

Dies entspricht der aktuellen Anwendung.

### Modus B: Produktionsziel

Anno-ähnliche Rückwärtsplanung:

- Zielware oder Zielgebäude
- Zielmenge oder Gebäudeanzahl
- Arbeitsmodus
- bevorzugte Produzenten
- exakter Bedarf
- Bauempfehlung
- Überschuss
- Arbeitsplätze
- Transportbedarf

Ein Zielplan verändert den Inselbestand nicht automatisch.

### Modus C: Versorgung

- Nahrung
- Vielfalt
- Lebensmittelläden
- Wohnen

Diese Sicht verwendet den Bestand aus Modus A und zusätzliche Einwohner- beziehungsweise Haushaltsangaben.

## Empfohlene Seitenstruktur für die Kolonialzeit

### Übersicht

- wichtigste Engpässe
- Warenüberschuss
- Transportstatus
- Nahrungsstatus
- Wohnkapazität
- Datenlücken

### Gebäude

- bestehende direkte Tabelle
- filterbar nach Kategorie
- neue Gebäudeauswahl

### Produktionsziel

- eigenes, reduziertes Zielformular
- darunter aufgelöste Kette

### Versorgung

Unterbereiche:

- Nahrung
- Wohnen

### Einstellungen

- DLCs
- Gebäudeauswahlvariante
- Monatsmodell
- Transportmodell
- Nahrungsmodell
- Anzeigeoptionen

## Darstellung einer Produktionskette

Empfohlene Standarddarstellung:

```text
[Zuckerplantage]
1,7 rechnerisch · 2 empfohlen
        ↓ 612.000 Zucker/Monat
[Rumdestillerie]
3 gebaut · Dunder-Destille
        ↓ 420.000 Rum/Monat
[Export]
```

Jede Stufe zeigt:

- Gebäude
- Modus
- exakte Zahl
- ganze Empfehlung
- vorhandene Zahl
- Fehl- oder Überbestand
- Warenfluss
- Datenstatus

Eine Tabelle bleibt als Detailansicht verfügbar.

## Produktionsketten der Kolonialzeit

### Grundspiel

- Holzstämme zu Brettern
- Zucker zu Rum
- Häute zu Leder

### The Llama of Wall Street

- Holzstämme zu Spielzeug

### Festival

- Rohstoffkombinationen zu Feuerwerk

### Return to Nature

- Holzstämme zu Kohle
- Holzstämme, Kokosnüsse, Baumwolle oder Wolle zu Papier
- Papier, optional Leder, zu Büchern

### Rohstoffe ohne koloniale Weiterverarbeitung

- Gold
- Eisen
- Tabak
- Kaffee
- Kakao
- Kautschuk
- Perlen

Diese Waren bleiben als Export-, Lager- oder spätere Produktionsreserve sichtbar.

## Nahrung im Anno-Vergleich

Anno kann häufig konkrete Einwohnerzahlen pro Produktionsgebäude nennen. Für Tropico ist zunächst nur folgende Darstellung belastbar:

- Nahrungsproduktion pro Modellmonat
- verfügbare Nahrungsmenge pro Einwohner
- kalibrierter Bedarf, falls Modellwert gesetzt
- Vielfalt aus acht möglichen Arten
- Besucherplätze im Lebensmittelladen

Der Planer soll klar zeigen, welche dieser Werte gemessen und welche modelliert sind.

## Wohnen im Anno-Vergleich

Anno-Rechner rechnen Gebäude häufig direkt aus Bevölkerungsstufen ab. Tropico-Haushalte und Familiengrößen sind nicht stabil genug dokumentiert.

Deshalb zunächst:

- vorhandene Haushaltsplätze
- Mindestwohlstand
- Qualität
- Kosten
- Arbeitsmodus

Keine automatische Umrechnung der Einwohnerzahl in benötigte Häuser.

## Endempfehlung

Der gewünschte Anno-Charakter entsteht nicht durch eine Kopie der Oberfläche, sondern durch:

- Zielauswahl
- Rückwärtsauflösung
- exakten und aufgerundeten Bedarf
- sichtbare Überschüsse
- alternative Produzenten
- feste Zeiteinheit
- gemeinsame Datenbasis für mehrere Ansichten

Die bestehende Tropico-Linie bleibt erhalten durch:

- direkte Gebäudeliste
- spielnahe Begriffe
- klare Warnungen
- getrennte Nahrung und Wohnen
- transparente Modellannahmen
- keine behauptete Weg- oder Verkehrssimulation
