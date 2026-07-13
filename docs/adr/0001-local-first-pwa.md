# ADR-0001: Local-First-PWA

- Status: akzeptiert
- Datum: 2026-07-13

## Kontext

Die Anwendung soll ohne Installation, Serverbetrieb und Benutzerkonto nutzbar sein, aber dennoch lokal speichern und offline funktionieren können.

## Entscheidung

Die erste Produktversion wird als local-first Progressive Web App geplant.

## Folgen

Positiv:

- niedrige Nutzungshürde
- offline nutzbar
- installierbar
- keine laufende Serverabhängigkeit
- persönliche Daten bleiben lokal

Negativ:

- keine automatische Synchronisierung zwischen Geräten
- Browserdaten können ohne Export verloren gehen
- Import und Export werden verpflichtend
