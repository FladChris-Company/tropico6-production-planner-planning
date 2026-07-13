# Recherche: Kolonialzeit-Planer

Stand: 13. Juli 2026

## Auftrag

Dieser Ordner dokumentiert die fachliche und technische Grundlage für die nächste Ausbaustufe des Tropico-6-Planers.

Der Fokus liegt auf:

- Kolonialzeit
- Grundspiel und auswählbaren DLCs
- theoretischer Produktion pro Monat
- theoretischer Logistik ohne Wege- und Verkehrssimulation
- Nahrungsproduktion, theoretischem Bedarf und Vielfalt
- Wohnkapazität, Wohnqualität, Wohlstand und Kosten
- zwei wählbaren Varianten der Gebäudeauswahl
- technischer Einpassung in die bestehende SvelteKit-Oberfläche

Es wurde kein Anwendungscode umgesetzt.

## Wichtigste Entscheidungen

- Die bestehende direkte Gebäudetabelle bleibt der Hauptarbeitsbereich.
- Die Suchauswahl ist der empfohlene Standard.
- Die Kaskadenauswahl Ära → Kategorie → Gebäude bleibt als Einstellung verfügbar.
- Die Kaskade funktioniert auf Desktop mit Klick, Tastatur und zusätzlichem Hover.
- Auf Mobilgeräten wird dieselbe Kaskade als Drill-down-Dialog dargestellt.
- Der Monat ist die Standardanzeige, basiert aber auf konfigurierbaren theoretischen Arbeitstagen.
- Produktionsraten aus dem Steam-Guide werden mit 1.000 in Warenbestands-Einheiten umgerechnet.
- Theoretisches Frachtvolumen und modellierte Transportbüro-Kapazität werden getrennt.
- Nahrungsvielfalt ist direkt berechenbar.
- Der Verbrauch je Einwohner bleibt ein sichtbarer Modellparameter, bis eine belastbare Messung vorliegt.
- Wohnen wird zunächst in Haushaltsplätzen ausgewertet, nicht in Einwohnern.
- Es wird keine automatische Wohnbauempfehlung erstellt.

## Kritischer Befund zur aktuellen Berechnung

Die bekannten Produktionsraten und die Transportladung verwenden derzeit unterschiedliche Größenordnungen.

Die Community-Raten sind Tausender-Einheiten. Deshalb gilt:

```text
Warenbestands-Einheiten = Messrate × 1.000
```

Ohne diese Skalierung wird die Transportkapazität gegenüber der Produktion ungefähr um Faktor 1.000 zu hoch dargestellt.

## Dokumentation

- [Forschungsstatus](00-research-status.md)
- [Umfang und Leitlinien](01-scope-and-principles.md)
- [Analyse des aktuellen Repository-Stands](02-current-state-analysis.md)
- [Gebäudeinventar Kolonialzeit](03-building-inventory.md)
- [Produktionsmodell](04-production-model.md)
- [Logistikmodell](05-logistics-model.md)
- [Nahrungsmodell](06-food-model.md)
- [Wohnmodell](07-housing-model.md)
- [UI- und Einstellungskonzept](08-ui-and-settings.md)
- [Datenmodell und Formeln](09-data-model-and-formulas.md)
- [Quellenregister und offene Daten](10-source-register-and-open-data.md)
- [Roadmap und Akzeptanzkriterien](11-roadmap-and-acceptance.md)
- [Technische UI-Machbarkeit](12-technical-ui-feasibility.md)
- [Übertragbare Muster aus Anno- und Produktionsrechnern](13-anno-patterns.md)
- [Prüf- und Teststrategie](14-testing-strategy.md)

## Empfohlene Lesereihenfolge

Für Produktentscheidungen:

- Forschungsstatus
- Umfang und Leitlinien
- Anno-Muster
- UI- und Einstellungskonzept
- Roadmap

Für die spätere Umsetzung:

- Ist-Analyse
- Gebäudeinventar
- Produktionsmodell
- Logistikmodell
- Nahrungsmodell
- Wohnmodell
- Datenmodell
- technische UI-Machbarkeit
- Teststrategie

Für weitere Recherche und Messungen:

- Quellenregister und offene Daten

## Datenqualitätsprinzip

Die Recherche trennt:

- bestätigte Werte
- gemessene Werte
- abgeleitete Werte
- Modellannahmen
- Quellenkonflikte
- unbekannte Werte

Unbekannte Werte werden nicht durch plausible Zahlen ersetzt.
