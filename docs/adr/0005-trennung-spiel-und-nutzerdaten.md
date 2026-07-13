# ADR-0005: Trennung von Spiel- und Nutzerdaten

- Status: akzeptiert
- Datum: 2026-07-13

## Kontext

Tropico-Stammdaten werden mit der Anwendung aktualisiert. Persönliche Planungsdaten gehören dem Nutzer.

## Entscheidung

Versionierte Spieldaten und lokale Nutzerdaten werden strikt getrennt.

## Folgen

- Spieldaten können unabhängig aktualisiert werden
- Nutzerdaten bleiben privat
- Imports benötigen Versions- und Migrationslogik
- stabile technische IDs sind zwingend erforderlich
