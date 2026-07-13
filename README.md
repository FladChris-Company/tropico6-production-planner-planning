# Tropico 6 Production Planner – Planning Repository

> **Status: private Entwicklungs- und Architekturphase**  
> Dieses Repository enthält bewusst **keinen Anwendungscode**. Es dient ausschließlich dazu, Produktumfang, Fachmodell, Architekturentscheidungen, Recherche, Annahmen und offene Fragen nachvollziehbar zu dokumentieren.

## Ziel

Geplant ist eine lokale, installierbare Webanwendung zur Planung und Analyse von Produktionssystemen in **Tropico 6**. Der erste fachliche Fokus liegt ausschließlich auf der **Kolonialzeit**, inklusive relevanter DLC-Inhalte.

Die Anwendung soll mehr sein als ein Verhältnisrechner. Sie soll den tatsächlichen Inselstand abbilden, frei definierbare Cluster unterstützen, Prognosen ohne Veränderung des Ist-Stands ermöglichen und typische Produktionsprobleme diagnostizieren.

## Aktueller Projektzustand

- Konzeptphase
- Architekturphase
- Datenrecherche noch nicht abgeschlossen
- Produktionswerte noch nicht vollständig verifiziert
- keine Implementierung
- kein finaler Produktname
- keine öffentliche Veröffentlichung
- keine finale Lizenzentscheidung

## Kernidee

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

## Arbeitsregel

Entscheidungen werden nicht stillschweigend überschrieben. Wesentliche technische oder fachliche Festlegungen erhalten einen Architecture Decision Record. Noch ungesicherte Annahmen werden ausdrücklich als Annahme oder offene Frage gekennzeichnet.
