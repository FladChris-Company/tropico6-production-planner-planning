# ADR-0002: Statische Bereitstellung

- Status: akzeptiert
- Datum: 2026-07-13

## Kontext

Das Deployment soll für die erste öffentliche Version möglichst wartungsarm bleiben.

## Entscheidung

Die Anwendung wird als statischer Build geplant. GitHub Pages ist das bevorzugte erste Hostingziel.

## Folgen

- kein eigener Webserver erforderlich
- automatische Bereitstellung über GitHub Actions möglich
- keine serverseitigen APIs in Version 1
- sämtliche Kernlogik läuft im Browser
