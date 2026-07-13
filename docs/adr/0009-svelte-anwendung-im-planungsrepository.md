# ADR-0009: Svelte-Anwendung im bisherigen Planungsrepository

- Status: akzeptiert
- Datum: 2026-07-13

## Kontext

Die Produkt- und UI-Architektur ist ausreichend konkret. Der bisherige Ein-Datei-Prototyp ist für die geplanten Module und wiederverwendbaren Ansichten nicht dauerhaft wartbar.

## Entscheidung

Das bestehende Repository enthält ab jetzt auch den produktiven Anwendungscode. Die Oberfläche wird mit SvelteKit und TypeScript umgesetzt, statisch gebaut und über GitHub Pages ausgeliefert. Fachlogik, Stammdaten, Speicherung und Darstellung bleiben getrennt.

Der Kern bleibt local-first. Es gibt weiterhin kein Backend und keine Benutzerkonten. Unsichere Spieldaten werden gekennzeichnet und können durch Nutzerdaten überschrieben werden.

## Folgen

- Planung, Dokumentation und Implementierung bleiben an einem Ort nachvollziehbar.
- Komponenten und Fachlogik können unabhängig getestet werden.
- GitHub Actions prüft Typen, Komponenten, Berechnungen und den statischen Build.
- ADR-0007 ist ersetzt.
