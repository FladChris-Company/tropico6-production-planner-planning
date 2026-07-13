# Roadmap und Akzeptanzkriterien

Stand: 13. Juli 2026

## Zweck

Dieses Dokument beschreibt die fachlich sinnvolle Reihenfolge einer späteren Umsetzung. Die aktuelle Recherchephase ändert keinen Anwendungscode.

## Priorität 0: Daten- und Einheitensicherheit

### Aufgaben

- Produktionsraten als Tausender-Einheiten normalisieren
- Warenbestands-Einheit als gemeinsame interne Einheit festlegen
- Quellenstatus auf Feldebene ermöglichen
- widersprüchliche Werte markieren
- unbekannte Werte konsequent als `null` führen
- Arbeitsmodi um eigene Freischaltära ergänzen
- deutschen Namen `Spielzeugfabrik` prüfen und vereinheitlichen

### Akzeptanzkriterien

- 1,5 Zucker in den Messdaten entspricht intern 1.500 Warenbestands-Einheiten.
- Produktions- und Transportwerte verwenden dieselbe Einheit.
- Eine unbekannte Rate führt zu keinem Zahlenwert und keiner Nullproduktion.
- Spätere Arbeitsmodi sind in der Kolonialzeit nicht auswählbar.
- Jeder koloniale Produktionswert zeigt seinen Datenstatus.

## Priorität 1: Theoretisches Monatsmodell

### Aufgaben

- `theoreticalWorkdaysPerMonth` einführen
- maximale und konfigurierte theoretische Leistung trennen
- Besetzung korrekt berücksichtigen
- Arbeitszeit- und Logistikabschläge aus der theoretischen Hauptberechnung entfernen
- Tooltips auf Monatsformeln umstellen

### Akzeptanzkriterien

- Monat ist die Standardanzeige.
- Der Nutzer sieht, dass die Arbeitstage eine Modellannahme sind.
- Ein Gebäude mit 50 Prozent Besetzung zeigt die Hälfte der konfigurierten theoretischen Leistung.
- Die maximale Kapazität bleibt bei 100 Prozent Besetzung sichtbar.
- Änderungen der Modellarbeitstage skalieren Produktion, Verbrauch und Transport konsistent.

## Priorität 2: Vollständige koloniale Produktionsketten

### Aufgaben

- Grundspielketten vollständig erfassen
- aktive DLC-Ketten ergänzen
- Arbeitsmodi je Ära filtern
- alternative Rohstoffquellen abbilden
- Zielberechnung und Bestandsprüfung auf dieselben Rezepte umstellen
- proportionale Verteilung gemeinsam genutzter Rohstoffe definieren

### Akzeptanzkriterien

- Zuckerplantage und Imkerei können bei aktivem DLC beide Zucker liefern.
- Holz kann zwischen Sägewerk, Spielzeugfabrik, Köhlerei, Papiermühle und Feuerwerksfabrik verteilt werden.
- Druckerei löst Papiermühle und deren Rohstoffbedarf rückwärts auf.
- Exakter Gebäudebedarf, aufgerundete Empfehlung und Reserve werden getrennt gezeigt.
- Deaktivierte DLCs werden nicht als automatische Rohstoffquelle ausgewählt.
- Fehlende Raten blockieren nur die betroffene Teilrechnung und werden benannt.

## Priorität 3: Gebäudeauswahl

### Aufgaben

- gemeinsame `BuildingPicker`-Schnittstelle definieren
- Suchvariante umsetzen
- Kaskadenvariante umsetzen
- Einstellung speichern
- responsive Mobilvariante ergänzen
- Tastatursteuerung und Fokusführung prüfen

### Akzeptanzkriterien Suchvariante

- Suchfeld steht oben im geöffneten Auswahlfenster.
- Suche findet Namen, Waren, Kategorien und DLCs.
- Auswahl funktioniert vollständig per Tastatur.
- bestehende Tabellenzeile behält Höhe und Grundgestaltung.
- deaktivierte DLC-Gebäude sind nicht neu auswählbar.

### Akzeptanzkriterien Kaskadenvariante

- erste Ebene zeigt Ären.
- zweite Ebene zeigt Kategorien.
- dritte Ebene zeigt Gebäude.
- spätere Ären sind sichtbar deaktiviert oder gemäß Einstellung ausgeblendet.
- Desktop unterstützt Hover zusätzlich, aber nicht ausschließlich.
- Mobil verwendet Drill-down statt seitlicher Flyouts.
- Pfeil rechts öffnet, Pfeil links schließt die Unterebene.

### Gemeinsame Akzeptanzkriterien

- Wechsel der Auswahlvariante verändert keine Insel- oder Szenariodaten.
- globale UI-Einstellung wird nach Neuladen wiederhergestellt.
- ein bestehendes Gebäude aus einem später deaktivierten DLC bleibt sichtbar.

## Priorität 4: Theoretische Logistik

### Aufgaben

- Frachtvolumen und Büro-Kapazität trennen
- Transportanteile nach Warenverwendung einführen
- lokalen Nahrungsverbrauch vom Transportbedarf abziehen
- Monatskapazität aus Arbeitstagen und Fahrten berechnen
- Datenvollständigkeit berücksichtigen

### Akzeptanzkriterien

- Rohstoff und Endprodukt werden als getrennte Transportetappen gezählt.
- derselbe Warenfluss wird nicht doppelt als Ausgang und Eingang addiert.
- lokal konsumierte Nahrung erzeugt keinen Transportbedarf.
- Transportbedarf zeigt `unvollständig`, wenn relevante Produktionsraten fehlen.
- angezeigt werden:
  - theoretisch zu transportieren
  - theoretisch transportierbar
  - Differenz
  - Auslastung
  - benötigte Büros
  - Bürodifferenz
- Tooltip enthält sämtliche Modellparameter.
- Büroempfehlung wird ausdrücklich als Modell bezeichnet.

## Priorität 5: Nahrung

### Aufgaben

- acht koloniale Nahrungswaren klassifizieren
- Nahrungsproduktion aus der Warenbilanz ableiten
- Industrie, Export und Reserve abziehen
- lokale und Ladenverteilung trennen
- Vielfalt berechnen
- kalibrierbaren Einwohnerbedarf einführen
- Lebensmittelladen als Versorgungsgebäude ergänzen

### Akzeptanzkriterien

- Zucker, Kakao und Kaffee zählen nicht als Nahrung.
- Fleisch und Milch aus Ranchen werden getrennt von Nebenprodukten summiert.
- Vielfalt zeigt Produktions-, verfügbare und Ladenvielfalt getrennt.
- ohne Bedarfsparameter erscheint keine erfundene Bedarfsdeckung.
- mit Bedarfsparameter werden Bedarf, Deckung, Reserve und Fehlmenge berechnet.
- 16 Besucherplätze je Lebensmittelladen werden angezeigt, aber nicht ohne weitere Daten in Einwohner pro Monat umgerechnet.
- unbekannte Fisch- oder Kokosraten markieren die Gesamtmenge als unvollständig, ohne die Vielfalt zu verstecken.

## Priorität 6: Wohnen

### Aufgaben

- koloniale Wohngebäude als eigene Stammdatenart ergänzen
- DLC-Wohngebäude filtern
- Arbeitsmodi abbilden
- Haushaltskapazität und Kosten berechnen
- Qualität gewichtet zusammenfassen
- Quellenkonflikte anzeigen

### Akzeptanzkriterien

- Kapazität wird in Haushalten, nicht in Einwohnern angegeben.
- Baracke im Modus `Stack Them Higher` besitzt acht Haushaltsplätze.
- Hütten sind erfassbar, aber nicht regulär baubar.
- Bauplan- und Baukosten werden getrennt behandelt.
- Bauplankosten werden nicht pro Gebäude multipliziert.
- Wohnqualität wird nach Haushaltsplätzen gewichtet.
- keine automatische Wohnbauempfehlung wird ausgegeben.

## Priorität 7: Übersichten und Diagnose

### Aufgaben

- Produktionsübersicht erweitern
- Nahrungsübersicht ergänzen
- Wohnübersicht ergänzen
- Datenqualitätswarnungen vereinheitlichen
- Empfehlungen nur bei belastbarer Grundlage ausgeben

### Akzeptanzkriterien

Die Übersicht beantwortet ohne Öffnen technischer Tabellen:

- Welche Ware ist knapp?
- Welche Produktionskette ist unterversorgt?
- Wie hoch ist das theoretische Frachtvolumen?
- Reicht die modellierte Transportkapazität?
- Wie viel Nahrung ist verfügbar?
- Wie vielfältig ist die Nahrung?
- Ist der Nahrungsbedarf kalibriert?
- Wie viele Haushaltsplätze existieren je Wohlstandsstufe?
- Welche Ergebnisse sind wegen fehlender Daten unvollständig?

## Priorität 8: Datenerhebung

### Aufgaben

- fehlende Grundspiel-Rohstoffraten messen
- Spielzeugfabrik normiert messen
- Feuerwerksfabrik normiert messen
- Return-to-Nature-Raten verifizieren
- Nahrungsverbrauch kalibrieren
- Lebensmittelladen-Durchsatz untersuchen
- Transportmodell kalibrieren

### Akzeptanzkriterien

- jeder Messwert besitzt ein Messprotokoll
- mindestens drei Wiederholungen
- Arbeiterbesuche werden gezählt
- Spielversion und DLCs werden dokumentiert
- Mittelwert und Abweichung werden gespeichert
- alte Werte bleiben mit Quellenhistorie nachvollziehbar

## Nicht vorziehen

Folgende Erweiterungen sollen nicht vor Abschluss der kolonialen Basis umgesetzt werden:

- vollständige Weltkriegsproduktion
- Tourismus
- Militärsimulation
- komplexe Bevölkerungsschichten
- Wege- oder Verkehrsmodell
- Karteneditor
- dynamischer Netzwerkgraph als Hauptansicht
- automatische Optimierung von Stadtlayouts

## Definition of Done für den kolonialen Forschungsumfang

Die spätere Umsetzung gilt fachlich als vollständig, wenn:

- alle relevanten kolonialen Gebäude inklusive DLCs vorhanden sind
- alle bekannten Raten korrekt skaliert werden
- unbekannte Raten transparent bleiben
- beide Gebäudeauswahlen funktionieren
- Produktion, Logistik, Nahrung und Wohnen getrennte, konsistente Ergebnisse liefern
- Monat als Modellperiode vollständig erklärt wird
- keine reale Weg- oder Verkehrssimulation behauptet wird
- bestehende lokale Daten migriert werden
- alle Formeln automatisiert getestet sind
- sämtliche Ergebnis-Tooltips die Herkunft der Zahlen erklären
