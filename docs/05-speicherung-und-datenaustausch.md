# Speicherung und Datenaustausch

## Aktueller Umsetzungsstand

Die produktive Minimalversion speichert Änderungen automatisch in `localStorage` des verwendeten Browsers. Die Daten bleiben beim normalen Schließen erhalten. Zusätzlich kann die aktive Insel als versionierte JSON-Datei gesichert und wieder importiert werden. Die spätere Umstellung auf IndexedDB bleibt ein Ausbauschritt.

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

Die aktive Insel kann in ein eigenes JSON-basiertes Dateiformat exportiert werden. Der Dateidownload findet vollständig im Browser statt.

Vorgesehene Metadaten:

- Formatkennung
- Schemaversion
- Exportzeitpunkt
- Projektinhalt

Eine eigenständige Spieldatenversion existiert im aktuellen Datenmodell noch nicht und wird deshalb nicht vorgetäuscht. Sie wird ergänzt, sobald die manuellen Stammdaten selbst versioniert werden.

## Import

Vor einem Import werden geprüft:

- Formatkennung
- Schemaversion
- Datenintegrität
- unbekannte Gebäude-IDs
- benötigte DLCs
- Konflikt mit bestehenden Projekt-IDs
- notwendige Migrationen

Der aktuelle Import unterstützt genau die Export-Schemaversion 1 und die Datenbankschemaversion 2. Er prüft die Projektstruktur, Szenario- und Clusterreferenzen, Zahlenwerte und alle Gebäude-IDs. Benötigte DLC-Kennungen werden aus den bekannten Gebäudedaten ergänzt. Eine importierte Insel wird zusätzlich angelegt und direkt ausgewählt; bestehende Inseln werden nicht überschrieben. Doppelte IDs und Namen werden eindeutig aufgelöst. Bei einem Fehler bleibt der lokale Stand unverändert.

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
