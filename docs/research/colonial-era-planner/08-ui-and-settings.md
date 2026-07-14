# UI- und Einstellungskonzept

Stand: 13. Juli 2026

> Hinweis zum Umsetzungsstand: Die spätere Spieler- und MVP-Entscheidung in
> `docs/11-bedienkonzept.md` und `docs/16-produkt-und-ui-zielarchitektur.md`
> ersetzt die hier untersuchte Tabellen-Hauptansicht durch kompakte Karten.
> Die Such- und Filterregeln dieses Dokuments bleiben für den Hinzufügen-Dialog
> relevant.

## Grundsatz

Die bestehende direkte Gebäudetabelle bleibt der Hauptarbeitsbereich. Die neue Funktionalität wird nicht als separates komplexes Dashboard vor die eigentliche Arbeit gesetzt.

Erhalten bleiben:

- Kopfzeile mit Zeitalter
- Übersicht und Gebäude als klare Hauptbereiche
- kompakte Tabellenzeilen
- Anzahl, Effizienz und Arbeitsmodus unmittelbar in der Zeile
- Berechnungsdetails im Popover
- eine primäre Aktion `Gebäude hinzufügen`

Erweitert werden:

- Gebäudeauswahl
- fachliche Spalten je Gebäudetyp
- Nahrung und Wohnen als zusätzliche übersichtliche Ergebnisbereiche
- Einstellungen

## Gebäudeauswahl als einheitliche Komponente

Beide gewünschten Varianten verwenden dieselbe fachliche Datenquelle und liefern am Ende genau eine `buildingVariantId` zurück.

Die Anwendung speichert nur die Einstellung:

```text
buildingPickerMode = search | cascade
```

Dadurch bleiben Szenarien und Gebäudeeinträge unabhängig von der gewählten Bedienvariante.

## Option 1: aktuelles Dropdown mit Suchfeld

### Ziel

Die Bedienung bleibt möglichst nah am aktuellen Select-Feld, wird aber bei vielen Gebäuden schneller durchsuchbar.

### Aufbau

- Auslöser in Größe und Stil des bisherigen Select-Feldes
- beim Öffnen erscheint ein Popover unter dem Feld
- Suchfeld als erste Zeile
- darunter Trefferliste
- Treffer optional nach Kategorie gruppiert
- aktive Auswahl markiert
- Datenstatus und DLC können klein als Zusatzinformation erscheinen

### Suchumfang

Die Suche berücksichtigt:

- deutschen Gebäudenamen
- englischen Gebäudenamen
- Kategorie
- erzeugte Ware
- verbrauchte Ware
- DLC-Name

Beispiele:

- `zucker` findet Zuckerplantage, Imkerei und Rumdestillerie
- `nahrung` findet alle kolonialen Nahrungsproduzenten
- `return` findet aktive Gebäude aus Return to Nature

### Filterregeln

- Grundspiel immer enthalten
- deaktivierte DLCs nicht auswählbar
- Gebäude nach aktueller Ära auswählbar
- spätere Gebäude abhängig von Einstellung entweder ausgeblendet oder deaktiviert sichtbar
- bestehende, aktuell nicht verfügbare Auswahl bleibt als Sonderzeile sichtbar

### Tastatur

- Öffnen über Enter, Leertaste oder Pfeil nach unten
- Suchfeld erhält Fokus
- Pfeil hoch und runter bewegt aktive Option
- Enter wählt
- Escape schließt
- Home und End springen zum ersten beziehungsweise letzten Treffer

### Vorteile

- geringste Abweichung von der aktuellen Bedienung
- schnell bei bekanntem Gebäudenamen
- gut für Desktop und Mobilgeräte
- nur eine Liste muss sichtbar sein
- einfacher zugänglich umzusetzen als ein verschachteltes Menü

### Nachteile

- Kategorien sind weniger stark sichtbar
- Nutzer müssen Namen oder Waren kennen
- bei leerer Suche bleibt die Liste lang

## Option 2: Kaskadenauswahl Ära → Kategorie → Gebäude

### Ziel

Der Nutzer navigiert zuerst nach Spielstruktur und sieht erst am Ende die konkreten Gebäude.

### Ebene 1: Zeitalter

- Kolonialzeit
- Weltkriege
- Kalter Krieg
- Moderne

Regeln:

- aktuelle und bereits erreichte Ären sind auswählbar
- noch nicht erreichte Ären sind deaktiviert und optisch zurückgenommen
- deaktivierte Ären können optional vollständig ausgeblendet werden
- ein Hinweis erklärt `In deiner aktuellen Partie noch nicht verfügbar`

Für den aktuellen Forschungsumfang führt nur die Kolonialzeit zu berechenbaren Gebäuden. Die anderen Ären dürfen als Vorschau erscheinen, aber nicht auswählbar sein.

### Ebene 2: Kategorie

Empfohlene stabile Kategorien:

- Rohstoffgewinnung
- Landwirtschaft
- Industrie
- Logistik und Infrastruktur
- Nahrung und Versorgung
- Wohnen
- Unterhaltung
- Luxusunterhaltung
- Medien und Bildung
- Öffentliche Dienste
- Militär
- Regierung und Finanzen

Für den ersten fachlichen Umfang werden nur relevante Kategorien mit auswählbaren Gebäuden aktiv dargestellt.

### Ebene 3: Gebäude

Die Gebäudeliste zeigt:

- deutschen Namen
- optional kleines Icon
- DLC-Kennzeichnung
- erzeugte Hauptware bei Produktionsvarianten
- Status unbekannter Produktionsrate

### Desktop-Verhalten

Die vom Nutzer gewünschte seitliche Abzweigung ist möglich:

- Öffnen der ersten Ebene per Klick
- Hover oder Pfeil rechts öffnet die nächste Ebene
- kurze Verzögerung verhindert unbeabsichtigtes Schließen beim Wechsel zwischen Spalten
- Klick fixiert die aktive Ebene
- Pfeil links kehrt zurück
- Auswahl eines Gebäudes schließt alle Ebenen

Wichtig: Hover ist nur eine zusätzliche Komfortfunktion. Die Bedienung muss vollständig ohne Hover funktionieren.

### Mobil-Verhalten

Seitliche Flyouts sind auf kleinen Bildschirmen ungeeignet. Dort wird dieselbe Kaskade als Drill-down innerhalb eines Dialogs oder Bottom Sheets dargestellt:

- Seite 1: Ära
- Seite 2: Kategorie
- Seite 3: Gebäude
- Zurück-Schaltfläche im Kopf
- aktuelle Auswahl bleibt sichtbar

Die fachliche Variante bleibt dieselbe, nur die Darstellung wechselt responsiv.

### Vorteile

- Spielstruktur und Zeitalter werden sichtbar
- für Nutzer geeignet, die Gebäude nicht beim Namen kennen
- Kategorien bleiben übersichtlich
- später gut auf alle Zeitalter erweiterbar

### Nachteile

- mehr Interaktionsschritte
- komplexere Tastatur- und Fokussteuerung
- Hover-Flyouts benötigen sorgfältige Positionierung
- auf Mobilgeräten ist eine andere Darstellung nötig

## Empfehlung zur Standardauswahl

Empfohlener Standard ist Option 1 `Suche`.

Begründung:

- entspricht dem aktuellen Bedienmodell
- geringerer technischer und barrierefreier Aufwand
- funktioniert gleichartig auf Desktop und Mobil
- ist für wiederholte Eingabe schneller

Option 2 bleibt eine vollwertige Einstellung für Nutzer, die nach Ära und Kategorie navigieren möchten.

## Einpassung in die bestehende Gebäudezeile

Die Auswahl ersetzt nur das bestehende native Gebäude-Select. Die übrige Tabellenzeile bleibt unverändert.

Beispiel Produktionszeile:

| Gebäude | Anzahl | Effizienz | Besetzung | Arbeitsmodus | Leistung | Aktion |
|---|---:|---:|---:|---|---|---|

Beispiel Wohnzeile:

| Gebäude | Anzahl | Arbeitsmodus | Haushalte | Wohnqualität | Mindestwohlstand | Kosten | Aktion |
|---|---:|---|---:|---:|---|---:|---|

Da unterschiedliche Gebäudetypen verschiedene Felder benötigen, sind zwei Darstellungsvarianten möglich:

### Variante A: typabhängige Tabellen

- Produktion
- Logistik
- Nahrung und Versorgung
- Wohnen

Jeder Bereich besitzt passende Spalten. Dies ist fachlich klarer.

### Variante B: gemeinsame Gebäudetabelle mit Detailspalte

- gemeinsame Spalten: Gebäude, Anzahl, Status, Leistung
- typabhängige Eingaben in Detailbereich oder Popover

Für die bestehende Linie wird Variante A empfohlen, sobald Nahrung und Wohnen hinzukommen. Die aktuelle Produktionsliste bleibt dabei nahezu unverändert.

## Gebäude hinzufügen

Die Schaltfläche `Gebäude hinzufügen` soll nicht mehr sofort das erste Produktionsgebäude anlegen.

Empfohlenes Verhalten:

- Schaltfläche öffnet die gewählte Gebäudeauswahl.
- Erst nach einer konkreten Auswahl wird ein Eintrag erzeugt.
- Der Eintrag erhält den ersten in der aktuellen Ära verfügbaren Arbeitsmodus.
- Abbrechen verändert das Szenario nicht.

Beim Ändern eines bestehenden Gebäudes:

- Anzahl und Status bleiben erhalten.
- inkompatibler Arbeitsmodus wird auf den ersten gültigen Modus gesetzt.
- manuelle Ratenüberschreibungen werden nach Bestätigung zurückgesetzt.
- Wechsel zwischen Gebäudetypen erfordert eine Warnung, wenn typabhängige Daten verloren gehen.

## Einstellungen

### Bereich Spielinhalt

- aktives Zeitalter
- aktive DLCs
- deaktivierte spätere Zeitalter anzeigen oder ausblenden
- DLC-Gebäude in der Auswahl kennzeichnen

### Bereich Bedienung

- Gebäudeauswahl: Suche oder Kaskade
- kompakte Tabellenzeilen
- Berechnungs-Tooltips aktivieren
- englische Originalnamen zusätzlich anzeigen
- Treffer nach Kategorien gruppieren

### Bereich Berechnungsperiode

- Anzeigeeinheit: Monat als Standard
- theoretische Arbeitstage pro Monat
- optional zusätzliche Anzeige je Arbeiter-Arbeitstag
- Dezimalstellen und Tausenderdarstellung

### Bereich Produktion

- Besetzung standardmäßig 100 Prozent
- unbekannte Raten manuell überschreibbar
- Datenqualitätsbadges anzeigen
- Aufrundungsreserve bei Zielberechnung anzeigen

### Bereich Transportmodell

- Transportkapazitätsmodell aktivieren
- Ladung je Fahrt
- Fahrten je Arbeiter-Arbeitstag
- Standardbesetzung eines Referenzbüros
- Standardeffizienz eines Referenzbüros
- Statusgrenzen für ausreichend, knapp und Risiko

### Bereich Nahrung

- Einwohnerzahl
- Nahrungsbedarf je Einwohner und Monat
- Sicherheitsreserve
- lokaler Konsumanteil
- Mindestmenge für eine als vorhanden zählende Nahrungsart

Der Bedarfswert wird ausdrücklich als Modellannahme gekennzeichnet.

### Bereich Wohnen

- Hütten in Gesamtkapazität einbeziehen
- Baupläne bereits freigeschaltet
- Quellenkonflikte anzeigen
- Wohnqualität nach Haushaltsplätzen gewichten

## Einstellungsebene

Nicht jede Einstellung gehört auf dieselbe Ebene.

### Global

- Gebäudeauswahlvariante
- kompakte Darstellung
- Tooltips
- Originalnamen
- Zahlenformat

### Pro Inselprojekt

- aktives Zeitalter
- aktive DLCs
- Einwohnerzahl
- Nahrungsmodell
- Berechnungsperiode, falls pro Insel abweichend

### Pro Szenario

- Gebäudeanzahlen
- Effizienz
- Besetzung
- Arbeitsmodi
- Produktions- und Nahrungsreserven
- Warenverteilung

Diese Trennung verhindert, dass eine UI-Präferenz fachliche Inselstände verändert.

## Visuelle Treue zum aktuellen Schema

Die neuen Bedienelemente übernehmen:

- 36 Pixel Feldhöhe
- bestehende Schrift
- bestehende Rahmenfarbe
- weiße Fläche
- rechteckige Form ohne erzwungene große Rundung
- Fokusrahmen im vorhandenen Blau-Grau
- dieselbe Tabellenbreite und Zeilenhöhe

Neue Popover verwenden:

- einen leichten Schatten
- denselben Rahmen wie die Tabelle
- keine großflächigen Tropico-Dekorationen
- klare aktive Zeile
- kleine, zurückhaltende DLC- und Statuskennzeichnung

Damit bleibt das aktuelle reduzierte Schema erhalten, obwohl die Auswahl technisch leistungsfähiger wird.

## Zustände

Jede Auswahlvariante benötigt:

- geschlossen
- geöffnet
- Suche leer
- keine Treffer
- Eintrag aktiv
- Eintrag ausgewählt
- Eintrag deaktiviert wegen Ära
- Eintrag deaktiviert wegen DLC
- vorhandener, aber aktuell nicht verfügbarer Eintrag
- Datenrate unbekannt
- Ladefehler ist nicht relevant, da Stammdaten lokal sind

## Barrierefreiheit

- sichtbares Label oder eindeutiger zugänglicher Name
- vollständige Tastaturbedienung
- Fokus bleibt beim Öffnen und Schließen kontrolliert
- aktive Option über `aria-activedescendant` oder roving tabindex
- deaktivierte Einträge werden semantisch als deaktiviert markiert
- Ära- und Kategorieuntermenüs melden ihren geöffneten Zustand
- Escape schließt immer die aktuelle Ebene
- Fokus kehrt zum Auslöser zurück

## Keine Vermischung mit Zielplanung

Die Gebäudeauswahl wählt ein konkretes Gebäude für den Inselbestand. Die spätere zielorientierte Produktionsplanung besitzt eine eigene Auswahl für:

- Zielware
- Zielgebäude
- Zielmenge
- bevorzugte Produzenten

Diese Auswahl darf optisch ähnlich sein, aber nicht dieselbe Aktion auslösen.
