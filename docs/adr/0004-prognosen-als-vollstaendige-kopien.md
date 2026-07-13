# ADR-0004: Prognosen als vollständige Kopien

- Status: akzeptiert
- Datum: 2026-07-13

## Kontext

Prognosen könnten nur Änderungen oder den vollständigen Planungsstand speichern.

## Entscheidung

Eine Prognose speichert zunächst eine vollständige Kopie ihres Basis-Snapshots. Die Änderungsliste wird daraus berechnet.

## Folgen

- einfachere Implementierung
- robuste und unabhängige Szenarien
- leichter Import und Export
- etwas redundante Daten
- spätere Umstellung auf reine Deltas bleibt möglich, ist aber nicht geplant
