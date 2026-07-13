# Technische Zielarchitektur

## Architekturziel

Die erste Version soll als statische, local-first Webanwendung umgesetzt werden. Sie benötigt für die Kernfunktionen keinen eigenen Server, keine zentrale Datenbank und kein Benutzerkonto.

## Vorgesehener Technologie-Stack

Noch nicht implementiert, aber als Zielbild festgelegt:

- SvelteKit
- TypeScript
- statischer Build
- IndexedDB
- Dexie als Zugriffsschicht
- Service Worker
- Web App Manifest
- PWA-Installation
- GitHub Actions
- GitHub Pages für eine spätere öffentliche Bereitstellung

## Schichten

### Domäne

Reine fachliche Berechnungen ohne Abhängigkeit von Oberfläche oder Speicherung.

Verantwortung:

- Produktion
- Verbrauch
- Arbeitskräfte
- Szenariovergleich
- Logistikschätzung
- Diagnose
- Nachhaltigkeit

### Anwendungslogik

Koordiniert Anwendungsfälle.

Beispiele:

- Insel anlegen
- Prognose aus Snapshot erstellen
- Prognose übernehmen
- Projekt exportieren
- Beobachtung auswerten

### Persistenz

Kapselt IndexedDB und spätere Migrationen.

### Präsentation

Benutzeroberfläche, Navigation, Formulare, Tabellen und Auswertungen.

### Stammdaten

Versionierte Tropico-Daten, getrennt von persönlichen Nutzerdaten.

## Architekturprinzipien

- Berechnungslogik bleibt unabhängig von UI und Datenbank.
- Spieldaten und Nutzerdaten werden strikt getrennt.
- Alle Berechnungen müssen automatisiert testbar sein.
- Unsichere Modelle liefern Vertrauensstufen statt Scheingenauigkeit.
- Nutzerdaten bleiben standardmäßig lokal.
- Exportformate werden versioniert.
- Migrationen werden von Anfang an berücksichtigt.
- Es gibt keine versteckten Annahmen in der Oberfläche.
