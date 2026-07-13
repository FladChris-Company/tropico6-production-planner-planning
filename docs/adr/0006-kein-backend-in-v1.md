# ADR-0006: Kein Backend in der ersten Version

- Status: akzeptiert
- Datum: 2026-07-13

## Kontext

Ein Backend würde Benutzerkonten, Synchronisierung und Freigaben ermöglichen, erhöht aber Entwicklung, Betrieb und Datenschutzaufwand deutlich.

## Entscheidung

Die erste Version erhält kein Backend und keine Benutzerkonten.

## Folgen

- einfacheres Deployment
- keine Serverkosten
- geringere Fehlerfläche
- keine automatische Synchronisierung
- Backup erfolgt über Export und Import
