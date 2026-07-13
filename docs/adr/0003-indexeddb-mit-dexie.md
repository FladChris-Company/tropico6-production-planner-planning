# ADR-0003: IndexedDB mit Dexie

- Status: akzeptiert
- Datum: 2026-07-13

## Kontext

Mehrere Inseln, Cluster, Snapshots, Prognosen und Beobachtungen überschreiten den sinnvollen Einsatz von localStorage.

## Entscheidung

IndexedDB wird als lokale Datenbank verwendet. Dexie ist als Zugriffsschicht vorgesehen.

## Folgen

- strukturierte lokale Speicherung
- Transaktionen und Indizes
- versionierbare Datenbankschemata
- zusätzlicher Migrationsaufwand
- Abhängigkeit von Browser-Speicherregeln
