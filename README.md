# Tropico 6 Production Planner – Entwicklungsrepository

> **Status: private Entwicklungs- und Testphase**  
> Dieses Repository ist nicht das spätere öffentliche Produktrepository. Es enthält Architektur, Recherche und eine intern produktiv geschaltete Testversion für die Kolonialzeit.

## Aktueller Teststand

- Version: `v0.1.0-beta.2`
- Fokus: Kolonialzeit
- Grundspiel und koloniale DLC-Produktionsgebäude
- lokales Speichern im Browser
- automatische Tests vor jedem Deployment
- Deployment über GitHub Pages
- Produktionswerte mit unsicherer Quellenlage bleiben editierbar und werden nicht als gesicherte Werte ausgegeben

## Heute testbarer Funktionsumfang

- mehrere Inselprojekte
- frei definierbare Cluster
- Gebäude hinzufügen, duplizieren, deaktivieren und entfernen
- gruppierte Gebäudeanzahlen
- Effizienz und Personalbesetzung
- Arbeitsmodi und Verbesserungsvarianten
- optionale Entfernung pro Gebäude oder Cluster
- Ist-Stand
- unabhängige Prognosen
- Prognosen vergleichen und in den Ist-Stand übernehmen
- Snapshots erstellen und wiederherstellen
- Produktion, Verbrauch, Restmenge und Fehlmenge je Ware
- externe Warenversorgung
- Mindestreserven und exportierbarer Überschuss
- Arbeitsplätze und offene Stellen
- Transportbelastung und geschätzter Transportbüro-Bereich
- Diagnosehinweise
- editierbare Ein- und Ausgaberaten je Gebäude
- DLC-Filter
- JSON-Import und -Export
- Offline-Grundlage als PWA

## Ziel

Die Anwendung soll mehr sein als ein Verhältnisrechner. Sie bildet den tatsächlichen Inselstand ab, unterstützt frei definierbare Cluster, ermöglicht Prognosen ohne Veränderung des Ist-Stands und diagnostiziert typische Produktionsprobleme.

Die Anwendung beantwortet vier zentrale Fragen:

- **Planen:** Welche Produktionsgebäude und Rohstoffquellen passen zusammen?
- **Prognostizieren:** Was verändert sich, wenn Gebäude hinzugefügt, entfernt oder angepasst werden?
- **Diagnostizieren:** Warum funktioniert eine Produktionskette im tatsächlichen Spielstand nicht wie erwartet?
- **Stabilisieren:** Ist die Produktion langfristig tragfähig, ausreichend versorgt und logistisch plausibel?

## Dokumentation

- [Projektvision](docs/00-projektvision.md)
- [Umfang Kolonialzeit](docs/01-umfang-kolonialzeit.md)
- [Funktionsumfang](docs/02-funktionsumfang.md)
- [Fachliches Domänenmodell](docs/03-domaenenmodell.md)
- [Technische Zielarchitektur](docs/04-technische-architektur.md)
- [Speicherung und Datenaustausch](docs/05-speicherung-und-datenaustausch.md)
- [Ist-Stand, Snapshots und Prognosen](docs/06-ist-stand-und-prognosen.md)
- [Produktionsmodell](docs/07-produktionsmodell.md)
- [Logistik und Transport](docs/08-logistik-und-transport.md)
- [Diagnosemodell](docs/09-diagnosemodell.md)
- [Datenqualität und Recherche](docs/10-datenqualitaet-und-recherche.md)
- [Bedienkonzept](docs/11-bedienkonzept.md)
- [Roadmap](docs/12-roadmap.md)
- [Offene Fragen](docs/13-offene-fragen.md)
- [Nicht-Ziele](docs/14-nicht-ziele.md)
- [Veröffentlichung und rechtlicher Rahmen](docs/15-veroeffentlichung.md)
- [ADR-Verzeichnis](docs/adr/README.md)
- [Spielerbedürfnisse](docs/research/spielerbeduerfnisse.md)
- [Quellenregister](docs/research/quellenregister.md)
- [Ideen-Backlog](docs/notes/ideen-backlog.md)
- [Entscheidungsprotokoll](docs/notes/entscheidungsprotokoll.md)

## Deployment

Der Workflow rekonstruiert den geprüften Release-Stand, führt die Berechnungstests und Syntaxprüfungen aus und veröffentlicht anschließend ausschließlich die statische Webanwendung.

## Arbeitsregel

Entscheidungen werden nicht stillschweigend überschrieben. Wesentliche technische oder fachliche Festlegungen erhalten einen Architecture Decision Record. Noch ungesicherte Annahmen werden ausdrücklich als Annahme oder offene Frage gekennzeichnet.
