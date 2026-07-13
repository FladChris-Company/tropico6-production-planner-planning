# Speicherung und Datenaustausch

## Aktueller Umsetzungsstand

Die produktive Minimalversion speichert Änderungen automatisch in `localStorage` des verwendeten Browsers. Die Daten bleiben beim normalen Schließen erhalten, sind aber ohne Sicherung nicht gegen gelöschte Websitedaten, Inkognito-Sitzungen oder einen Gerätewechsel geschützt. JSON-Import und -Export sowie die spätere Umstellung auf IndexedDB bleiben verpflichtende Ausbauschritte.

## Primäre Zielspeicherung

Persönliche Daten werden lokal im Browser in IndexedDB gespeichert.

Gespeichert werden:

- Inselprojekte
- Cluster
- Gebäudeeinträge
- Snapshots
- Prognosen
- Lagerstände
- Beobachtungen
- Benutzereinstellungen

## Stammdaten

Allgemeine Tropico-Daten werden versioniert mit der Anwendung ausgeliefert.

Dazu gehören:

- Gebäude
- Waren
- Upgrades
- Arbeitsmodi
- Produktionsregeln
- DLC-Zuordnung
- Quellenstatus

## Autosave

Jede bestätigte Änderung wird automatisch gespeichert.

Die Oberfläche soll anzeigen:

- lokal gespeichert
- Zeitpunkt der letzten Speicherung
- eventuelle Speicherfehler

## Export

Ein Projekt kann in ein eigenes JSON-basiertes Dateiformat exportiert werden.

Vorgesehene Metadaten:

- Formatkennung
- Schemaversion
- Spieldatenversion
- Exportzeitpunkt
- Projektinhalt

## Import

Vor einem Import werden geprüft:

- Formatkennung
- Schemaversion
- Datenintegrität
- unbekannte Gebäude-IDs
- benötigte DLCs
- Konflikt mit bestehenden Projekt-IDs
- notwendige Migrationen

## Persistenter Browser-Speicher

Die Anwendung soll persistenten Browserspeicher anfragen können. Dies ersetzt kein Backup.

## Kein Cloud-Zwang

Die Kernanwendung bleibt ohne Konto und ohne Cloud vollständig nutzbar.

## Spätere optionale Cloud-Erweiterung

Erst bei Bedarf:

- Benutzerkonten
- Synchronisierung zwischen Geräten
- serverseitige Backups
- Freigabelinks
- gemeinsame Bearbeitung

Diese Erweiterung darf die Local-First-Nutzung nicht entfernen.
