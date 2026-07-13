# Tropico 6 Produktionsplaner

> **Status: öffentliche Beta für die Kolonialzeit**  
> Die Anwendung wird aktiv entwickelt. Produktionswerte mit unsicherer Quellenlage bleiben erkennbar und können angepasst werden.

## Anwendung

[Produktionsplaner öffnen](https://fladchris-company.github.io/tropico6-production-planner-planning/)

## Aktueller Stand

- Version: `v0.2.0-beta`
- Fokus: ausschließlich Kolonialzeit
- Grundspiel und koloniale DLC-Produktionsgebäude
- lokale Speicherung im Browser
- Import und Export als Sicherung
- automatische Prüfung vor jeder Veröffentlichung

## Aus Spielersicht

Der Planer soll nicht nur Zahlen zeigen, sondern typische Fragen während einer Partie beantworten:

- Reichen meine Rohstoffe für die vorhandene Industrie?
- Was fehlt für eine weitere Fabrik?
- Welche Ware kann ich als Überschuss exportieren?
- Wie viele zusätzliche Arbeiter benötigt ein Ausbau?
- Welche Auswirkungen hat eine neue Prognose gegenüber meinem Ist-Stand?
- Welcher Cluster verursacht voraussichtlich hohen Transportaufwand?

## Funktionsumfang

- mehrere Inselprojekte
- frei definierbare Cluster
- schneller Gebäudeeintrag mit Anzahl und Cluster
- Vorlagen für Rum, Bretter und Leder
- Gebäude hinzufügen, duplizieren, deaktivieren und entfernen
- Effizienz, Personalbesetzung und Arbeitsmodi
- optionale Entfernung als verständliche Kategorie
- unveränderlicher Ist-Stand
- unabhängige Ausbauprognosen
- Vergleich zwischen Ist-Stand und Prognose
- Prognosen übernehmen, kopieren und löschen
- Produktionsketten mit Versorgungsgrad
- konkrete Hinweise zu fehlenden Rohstoffgebäuden
- Produktion, Verbrauch, Restmenge und Fehlmenge je Ware
- externe Warenversorgung und Mindestreserven
- exportierbare Überschüsse
- Arbeitsplätze und offene Stellen
- Transportbüros und Transporteinschätzung
- DLC-Filter für koloniale Produktionsinhalte
- JSON-Import und -Export
- mobile Darstellung und Offline-Grundlage

## Speicherung

Inseln und Prognosen werden lokal im jeweiligen Browser gespeichert. Sie sind nicht öffentlich sichtbar und werden nicht an einen Server übertragen. Für Sicherungen und den Wechsel auf ein anderes Gerät steht der JSON-Export zur Verfügung.

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
- [ADR-Verzeichnis](docs/adr/README.md)

## Hinweis

Tropico 6 und die zugehörigen Bezeichnungen sind Eigentum der jeweiligen Rechteinhaber. Dieses Projekt ist ein unabhängiges, nicht offizielles Fan-Werkzeug.
