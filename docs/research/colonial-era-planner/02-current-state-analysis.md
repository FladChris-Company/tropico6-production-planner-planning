# Analyse des aktuellen Repository-Stands

Stand: 13. Juli 2026

## Technischer Ausgangspunkt

Die Anwendung ist eine statisch ausgelieferte SvelteKit-Anwendung mit Svelte 5, TypeScript, Vite und Vitest. Die Hauptseite lädt derzeit eine zentrale Komponente `Planner.svelte`.

Die aktuelle Architektur ist für den nächsten Schritt grundsätzlich geeignet:

- deklarative Gebäudedaten
- zentrale Szenarioberechnung
- lokale Speicherung
- projektbezogene Ära
- projektbezogene DLC-Liste
- Datenstatus je Gebäude
- Arbeitsmodi je Gebäude
- Ergebnis-Popover mit Berechnungsweg

## Was bereits zur gewünschten Linie passt

- Die Gebäudeansicht ist direkt und tabellarisch.
- Anzahl, Effizienz und Arbeitsmodus stehen nebeneinander.
- Die Übersicht zeigt Warenüberschuss, Transport, Hinweise und Arbeitskräfte.
- DLCs werden bereits vor der Gebäudeauswahl gefiltert.
- Gebäude späterer Zeitalter werden bereits über `buildingAvailableInEra` gefiltert.
- Produktionsketten werden über Ein- und Ausgänge modelliert, nicht hart pro Kette programmiert.
- Unbekannte Raten führen zu einer Warnung statt zu erfundenen Ergebnissen.

Diese Punkte sollen erhalten bleiben.

## Kritische fachliche Lücken

### Einheitenskala

Die Community-Raten werden derzeit direkt als Warenbestands-Einheiten behandelt. Die Profitrechnung der Quelle zeigt jedoch, dass eine Rate von `1` einer Menge von 1.000 Warenbestands-Einheiten entspricht.

Beispiel Rumdestillerie:

- 3,5 Rum × 9,2 Tausend Dollar je Tausend Einheiten
- minus 6,8 Zucker × 2,5 Tausend Dollar je Tausend Einheiten
- ergibt 15,2 Tausend Dollar Gewinn je Arbeiter-Arbeitstag

Daraus folgt:

`inventoryUnits = measuredRate × 1.000`

Ohne diesen Faktor werden Produktionsmenge und Transportladung um etwa Faktor 1.000 gegeneinander verschoben. Das ist die wichtigste Modellkorrektur vor einer Erweiterung.

### Theoretisch und erwartet sind vermischt

Der Kern verwendet für die Szenariobilanz weiterhin `worktimeFactor` und `logisticsFactor`. Der aktuelle Auftrag verlangt zunächst nur theoretische Werte. Deshalb muss die fachliche Spezifikation diese Abschläge aus dem Hauptmodell entfernen und nur für eine spätere erwartete Ebene aufbewahren.

### Beschäftigungsgrad

Die Einzelanzeige der theoretischen Produktionsleistung berücksichtigt gegenwärtig Anzahl, Arbeiterstellen und Effizienz, aber nicht die eingetragene Besetzung. Für eine klare Darstellung werden zwei Werte benötigt:

- maximale Kapazität bei 100 Prozent Besetzung
- konfigurierte theoretische Leistung bei eingetragener Besetzung

### Gebäudetypen

Der Typ `Building.kind` kennt nur:

- Produktion
- Transportbüro
- Infrastruktur

Für Nahrung und Wohnen fehlen strukturierte Eigenschaften. Wohngebäude und Lebensmittelläden können daher nicht sauber berechnet werden, ohne das Stammdatenmodell zu erweitern.

### Arbeitsmodi nach Zeitalter

Arbeitsmodi besitzen derzeit keine eigene Freischaltära. Dadurch können bei einem kolonialen Gebäude spätere Arbeitsmodi sichtbar werden. Beispiel: Die Spielzeugfabrik darf in der Kolonialzeit nur den kolonial verfügbaren Modus anbieten.

### Namen und Kategorien

- `Spielzeugwerkstatt` sollte gegen den deutschen Spielnamen `Spielzeugfabrik` abgeglichen und vereinheitlicht werden.
- Kategorien sind freie Texte und teilweise nach DLC statt nach Spielfunktion benannt.
- Für die Kaskadenauswahl werden stabile Kategorie-IDs und separate deutsche Anzeigenamen benötigt.

### Transportmodell

Die vorhandene Formel für Transportbüros ist transparent, aber vollständig modellbasiert. Sie verwendet:

- Ladung je Fahrt
- Arbeitsplätze
- Besetzung
- Effizienz
- Arbeitsmodusfaktor
- angenommene Fahrtenzahl

Die Formel darf bleiben, muss aber von dem sicher ableitbaren Frachtvolumen getrennt werden. Zusätzlich muss die Monatsperiode konsistent auf Produktion und Transport angewendet werden.

## UI-Ausgangslage

Die aktuelle Oberfläche verwendet:

- native Select-Felder
- eine kompakte Tabelle
- weiße und graue Flächen
- eine sehr kleine Navigationsstruktur
- horizontales Scrollen auf schmalen Bildschirmen

Die neue Gebäudeauswahl kann das bestehende Erscheinungsbild übernehmen. Sie darf nicht automatisch die größere, in der Zielarchitektur beschriebene Drei-Zonen-Oberfläche erzwingen.

## Empfohlene technische Zerlegung für eine spätere Umsetzung

Ohne in dieser Recherche Code zu ändern, ist folgende spätere Aufteilung sinnvoll:

- `BuildingPicker.svelte`
- `SearchBuildingPicker.svelte`
- `CascadingBuildingPicker.svelte`
- `BuildingTable.svelte`
- `FoodSummary.svelte`
- `HousingSummary.svelte`
- `LogisticsSummary.svelte`
- reine Selektoren für filterbare Gebäudegruppen
- reine Berechnungsfunktionen ohne UI-Texte

`Planner.svelte` bleibt Orchestrator, verliert aber die Verantwortung für jedes einzelne Bedienelement.

## Speicher- und Migrationsbedarf

Die Datenbank verwendet derzeit Schema 2. Für die späteren Einstellungen werden mindestens benötigt:

- Gebäudeauswahlvariante
- theoretische Arbeitstage pro Monat
- Nahrungsbedarf je Einwohner und Monat als Modellparameter
- lokaler Nahrungsverbrauchsanteil
- Transportfahrten je Arbeiter und Arbeitstag
- optionale Anzeige deaktivierter Zeitalter

Eine spätere Migration muss alte lokale Speicherstände erhalten und fehlende Felder mit sicheren Standardwerten ergänzen.
