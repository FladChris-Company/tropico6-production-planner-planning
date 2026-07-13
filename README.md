# Tropico 6 Produktionsplaner

> **Status: produktiv nutzbare Version für die Kolonialzeit**
> Produktionswerte mit unsicherer Quellenlage bleiben erkennbar und können direkt angepasst werden.

## Anwendung

[Produktionsplaner öffnen](https://fladchris-company.github.io/tropico6-production-planner-planning/)

## Aktueller Stand

- Version: `v1.0.0`
- Fokus: ausschließlich Kolonialzeit
- Grundspiel und koloniale DLC-Produktionsgebäude
- lokale Speicherung im Browser
- Import und Export als geplanter Sicherungsschritt
- automatische Prüfung vor jeder Veröffentlichung

## Produktarchitektur

Der Planer ist als modulare, statische SvelteKit-Anwendung umgesetzt. Der zielorientierte Produktionskern verbindet Produktionsbilanz, Arbeitsplätze und eine bewusst qualitative Logistikbewertung.

Die Oberfläche zeigt Ergebnisse und konkrete Empfehlungen vor technischen Parametern. Produktionsgebäude werden als Karten dargestellt; die Warenbilanz bleibt eine gezielte Detailansicht.

[Produkt- und UI-Zielarchitektur öffnen](docs/16-produkt-und-ui-zielarchitektur.md)

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
- JSON-Import und -Export (geplant)
- mobile Darstellung und Offline-Grundlage

## Speicherung

Inseln und Prognosen werden aktuell automatisch im lokalen Speicher des jeweiligen Browsers gespeichert. Sie sind nicht öffentlich sichtbar und werden nicht an einen Server übertragen. Eine Sicherung per JSON-Export ist geplant, aber in der Minimaloberfläche noch nicht verfügbar.

## Lokale Entwicklung

Voraussetzung ist Node.js 22.

```text
npm install
npm run dev
```

Qualitätsprüfung und Produktions-Build:

```text
npm run check
npm test
npm run build
```

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
- [Produkt- und UI-Zielarchitektur](docs/16-produkt-und-ui-zielarchitektur.md)
- [ADR-Verzeichnis](docs/adr/README.md)

## Hinweis

Tropico 6 und die zugehörigen Bezeichnungen sind Eigentum der jeweiligen Rechteinhaber. Dieses Projekt ist ein unabhängiges, nicht offizielles Fan-Werkzeug.
