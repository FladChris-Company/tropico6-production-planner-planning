# Forschungsstatus

Stand: 13. Juli 2026

## Ergebnis in einem Satz

Die vorhandene Anwendung besitzt bereits einen brauchbaren deklarativen Produktionskern, benötigt für einen Anno-ähnlichen Kolonialzeit-Planer aber eine saubere Einheitennormalisierung, vollständige koloniale Stammdaten, getrennte Modelle für Nahrung und Wohnen sowie eine eigenständige, zugängliche Gebäudeauswahl.

## Wichtigste Befunde

- Die bestehende direkte Gebäudetabelle soll erhalten bleiben.
- Grundspiel und DLCs bleiben projektbezogen auswählbar.
- Produktionsdaten werden intern in realen Warenbestands-Einheiten geführt.
- Die bekannten Community-Raten sind Tausender-Einheiten je Arbeiter-Arbeitstag und müssen mit 1.000 skaliert werden.
- Der Monat ist eine Anzeige- und Planungsperiode, benötigt aber einen sichtbaren Modellfaktor für theoretische Arbeitstage.
- Logistik wird in zwei Ebenen getrennt: sicher ableitbares Frachtvolumen und modellierte Transportbüro-Kapazität.
- Nahrungsvielfalt ist berechenbar; ein exakter Nahrungsverbrauch je Einwohner ist öffentlich nicht belastbar dokumentiert und muss als Modellparameter behandelt werden.
- Wohnen wird zunächst über Haushaltsplätze, Qualität, Mindestwohlstand und Kosten ausgewertet, ohne automatische Bauempfehlung.
- Beide gewünschten Varianten der Gebäudeauswahl sind mit Svelte 5 technisch umsetzbar.
- Die Kaskadenvariante darf nicht ausschließlich auf Hover beruhen; sie benötigt Klick-, Tastatur- und Mobilbedienung.

## Dokumente

- `01-scope-and-principles.md`
- `02-current-state-analysis.md`
- `03-building-inventory.md`
- `04-production-model.md`
- `05-logistics-model.md`
- `06-food-model.md`
- `07-housing-model.md`
- `08-ui-and-settings.md`
- `09-data-model-and-formulas.md`
- `10-source-register-and-open-data.md`
- `11-roadmap-and-acceptance.md`
- `12-technical-ui-feasibility.md`
- `13-anno-patterns.md`
- `14-testing-strategy.md`
