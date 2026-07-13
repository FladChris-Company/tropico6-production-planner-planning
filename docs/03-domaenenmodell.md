# Fachliches Domänenmodell

## IslandProject

Repräsentiert eine Insel oder einen separaten Planungsspielstand.

Attribute:

- ID
- Name
- ausgewähltes Zeitalter
- Spielversion
- aktivierte DLCs
- Erstellungsdatum
- Änderungsdatum
- aktueller Ist-Snapshot
- Notizen

## Cluster

Eine frei definierbare räumliche oder organisatorische Gebäudegruppe.

Attribute:

- ID
- Projekt-ID
- Name
- Beschreibung
- optionale Entfernung zum Hafen
- optionale Arbeiterentfernung
- optionale Beziehungen zu anderen Clustern

## BuildingDefinition

Stammdatensatz eines Gebäudetyps.

Attribute:

- stabile technische ID
- deutscher Name
- englischer Name
- Epoche
- DLC
- Kategorie
- Arbeitsplätze
- Bildungsanforderung
- Eingangswaren
- Ausgangswaren
- Nebenprodukte
- Basiswerte
- mögliche Upgrades
- mögliche Arbeitsmodi
- Quellen und Verifizierungsstatus

## BuildingEntry

Konkreter Gebäudeeintrag innerhalb eines Snapshots oder Szenarios.

Attribute:

- ID
- Cluster-ID
- BuildingDefinition-ID
- Anzahl
- Effizienz
- beschäftigte Arbeiter
- Arbeitsmodus
- Upgrades
- Aktivstatus
- optionale Entfernungen
- Notiz

## Snapshot

Unveränderlicher gespeicherter Inselstand.

Attribute:

- ID
- Projekt-ID
- Name
- Erstellungsdatum
- vollständige Clusterkopie
- vollständige Gebäudekopie
- Lagerbestände
- Warenregeln
- Beobachtungswerte

## Scenario

Veränderbare Prognose auf Basis eines Snapshots.

Attribute:

- ID
- Projekt-ID
- Basis-Snapshot-ID
- Name
- vollständiger eigener Planungsstand
- berechnete Änderungsliste
- Status

## GoodDefinition

Stammdatensatz einer Ware.

Attribute:

- ID
- deutscher Name
- englischer Name
- Typ
- Epoche
- DLC
- direkt exportierbar
- weiterverarbeitbar

## StockState

Bestand einer Ware in Lager, Produktionsgebäude oder Hafen.

Attribute:

- Ware
- aktueller Bestand
- Kapazität
- Mindestreserve
- Exportregel
- reservierte Menge

## Observation

Vom Nutzer gemessener oder beobachteter Wert.

Attribute:

- Zeitpunkt
- Zielobjekt
- Eingangslager
- Ausgangslager
- Hafenbestand
- Beschäftigung
- Effizienz
- Bemerkung

## DiagnosticFinding

Ergebnis einer Diagnose.

Attribute:

- Typ
- Schweregrad
- Vertrauensstufe
- betroffene Objekte
- Begründung
- Handlungsempfehlung
