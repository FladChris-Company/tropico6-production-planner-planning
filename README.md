# Tropico 6 Produktionsplaner

Work in Progress
-> aus meinen .xlsx dateien eine webanwendung mit KI erstellen

> **Status: produktiv nutzbare Version für die Kolonialzeit**
> Produktionswerte mit unsicherer Quellenlage bleiben erkennbar und können direkt angepasst werden.

## Anwendung

[Produktionsplaner öffnen](https://fladchris-company.github.io/tropico6-production-planner-planning/)

## Aktueller Stand

- Version: `v1.0.0`
- Fokus: ausschließlich Kolonialzeit
- Grundspiel und koloniale DLC-Produktionsgebäude
- zielorientierte Rückwärtsplanung für berechenbare Kolonialketten
- lokale Speicherung im Browser mit Migration älterer Inselstände und sichtbarer Datenrettung bei Fehlern
- Inseln als versionierte JSON-Sicherung exportieren und sicher wieder importieren
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
- durchsuchbare Gebäudeauswahl, die erst nach einer bewussten Auswahl einen Eintrag anlegt
- kompakte Gebäudekarten mit Ergebnis und Engpass vor den Eingaben
- direkte Planungsaktionen für fehlende Rohstoffgebäude
- Vorlagen für Rum, Bretter und Leder
- Gebäude hinzufügen, duplizieren, deaktivieren und entfernen
- Grundeffizienz, Personalbesetzung und Arbeitsmodi
- gebaut, geplant und deaktiviert direkt am Gebäude
- aufklappbare Expertendetails für Gebäudetyp, Arbeitsmodus, Cluster, Entfernung, Notizen und eigene Produktionsraten
- externe Warenversorgung direkt an den betroffenen Fabrikeingängen
- belegte koloniale Verbesserungen aus der manuellen Wissensquelle
- unveränderlicher Ist-Stand
- unabhängige Ausbauprognosen
- Vergleich zwischen Ist-Stand und Prognose
- Prognosen übernehmen, kopieren und löschen
- Produktionsketten mit Versorgungsgrad
- konkrete Hinweise zu fehlenden Rohstoffgebäuden
- Produktionsziel nach Endgebäude, Arbeitsmodus und gewünschter Anzahl
- Vergleich der Empfehlung mit bereits gebauten und geplanten Gebäuden
- zusätzlicher Arbeiterbedarf des empfohlenen Ausbaus
- Produktion, Verbrauch, Restmenge und Fehlmenge je Ware
- externe Warenversorgung und Mindestreserven
- exportierbare Überschüsse
- Arbeitsplätze und offene Stellen
- Transportbüros und Transporteinschätzung
- DLC-Filter für koloniale Produktionsinhalte
- JSON-Import und -Export mit Format-, Schema- und Gebäudedatenprüfung
- Wiederherstellungsansicht statt stiller Beispielinsel bei beschädigten oder unbekannten lokalen Daten
- mobile Darstellung und Offline-Grundlage

## Speicherung

Inseln und Prognosen werden automatisch im lokalen Speicher des jeweiligen Browsers gespeichert. Bekannte ältere Speicherstände werden verlustfrei auf das aktuelle Schema migriert. Beschädigte oder unbekannte Daten werden nicht automatisch ersetzt: Der Planer bietet zuerst eine Sicherung der Rohdaten und verlangt eine ausdrückliche Bestätigung, bevor eine neue Beispielinsel angelegt wird. Über „Sicherung“ kann die aktive Insel außerdem als JSON-Datei gespeichert und später wieder importiert werden. Ein Import legt eine eigene Insel an und überschreibt den vorhandenen Stand nicht. Die Daten werden nur auf dem Gerät verarbeitet und nicht an einen Server übertragen.

## Spieldaten für den Kolonialzeit-MVP

Die CSV-Dateien unter `manual/` sind die gepflegte Wissensquelle für Gebäude, Waren, Produktionsrezepte, Arbeitsmodi, Verbesserungen und Quellen. Ein validierter Generator erzeugt daraus die von der Anwendung verwendeten Kolonialdaten in `src/lib/domain/generated/colonial-data.json`.

Gemessene und ausdrücklich gekennzeichnete geschätzte Raten je Arbeiter-Arbeitstag werden in Warenbestands-Einheiten umgerechnet. Ein Ratenpunkt entspricht dabei 1.000 Warenbestands-Einheiten. Schätzungen bleiben direkt am Ergebnis erkennbar und erklären ihre Annahmen im Tooltip. Bei fehlender Zeitrate zeigt der Planer trotzdem den belegten Produktionsweg und gegebenenfalls eine dokumentierte Testcharge; eine korrekte Gebäudeanzahl wird daraus nicht vorgetäuscht.

## Lokale Entwicklung

Voraussetzung ist Node.js 22.

```text
npm install
npm run dev
```

Qualitätsprüfung und Produktions-Build:

```text
npm run data:check
npm run check
npm test
npm run build
```

Nach einer Änderung der verwendeten CSV-Wissensquelle:

```text
npm run data:generate
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
