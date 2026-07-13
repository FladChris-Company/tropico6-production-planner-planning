# Technische Zielarchitektur

## Architekturziel

Die Anwendung wird als statische, local-first Webanwendung umgesetzt. Sie benötigt für die Kernfunktionen keinen eigenen Server, keine zentrale Datenbank und kein Benutzerkonto.

Das fachliche Ziel ist ein modularer Tropico-Planer, der Produktionsplanung, Bevölkerungsbedarf, Arbeitskräfte und Logistik über ein gemeinsames Inselmodell verbindet. Die Module bleiben voneinander getrennt, teilen aber denselben Ist-Stand, dieselben Prognosen und dieselben versionierten Stammdaten.

## Vorgesehener Technologie-Stack

- SvelteKit
- TypeScript
- statischer Build
- IndexedDB
- Dexie als Zugriffsschicht
- Service Worker
- Web App Manifest
- PWA-Installation
- GitHub Actions
- GitHub Pages

## Fachliche Module

- Insel und Szenarien
- Produktion
- Bevölkerung und Versorgung
- Arbeitskräfte
- Logistik
- Empfehlungen und Diagnose
- Einstellungen und Datenaustausch

Module dürfen über definierte Domänenabfragen zusammenarbeiten, greifen aber nicht direkt auf die interne Logik anderer Module zu.

## Schichten

### Domäne

Reine fachliche Berechnungen ohne Abhängigkeit von Oberfläche oder Speicherung.

Verantwortung:

- Produktionsziele rückwärts bis zu Rohstoffen auflösen
- theoretische und erwartete Produktion berechnen
- Verbrauch, Überschüsse und Fehlmengen berechnen
- gebaut, geplant und empfohlen vergleichen
- Arbeitskräfte nach Bildungsstufe bilanzieren
- Bevölkerungs- und Versorgungsbedarf schätzen
- Logistikrisiken bewerten
- Ursachen und Handlungsoptionen strukturiert liefern
- Szenarien vergleichen

### Anwendungslogik

Koordiniert Anwendungsfälle.

Beispiele:

- Insel anlegen
- Produktionsziel erstellen
- Produktionsziel als Prognose speichern
- Empfehlung teilweise in einen Plan übernehmen
- Prognose aus Ist-Stand erstellen
- Prognose übernehmen
- Gebäudedetails zusammengefasst oder einzeln bearbeiten
- Projekt exportieren und importieren
- Beobachtungsdaten auswerten

### Persistenz

Kapselt IndexedDB und spätere Migrationen.

Gespeichert werden unter anderem:

- Inselprojekte
- Ist-Stände
- Snapshots
- Prognosen
- Produktionsziele
- geplante Gebäude
- Cluster
- Nutzeranpassungen an Annahmen und Stammdaten
- UI-Einstellungen

### Präsentation

Die Präsentationsschicht ist ergebnisorientiert und liefert getrennte View-Modelle für:

- Inselübersicht
- Produktionsketten
- Gebäudekarten
- Gebäude-Detailbereich
- Bevölkerung
- Arbeitskräfte
- Logistik
- Empfehlungen

Die Domäne erzeugt keine fertigen UI-Texte. Sie liefert strukturierte Ursachen, Statuswerte, Vertrauensstufen und mögliche Aktionen. Die Präsentationsschicht übersetzt diese in spielernahe Aussagen.

### Stammdaten

Versionierte Tropico-Daten, getrennt von persönlichen Nutzerdaten.

Stammdaten umfassen:

- Gebäude
- Waren
- Produktionsrezepte
- Ära und DLC-Verfügbarkeit
- Arbeitsplätze und Bildungsstufen
- Arbeitsmodi und Verbesserungen
- Medienreferenzen für Bilder und Icons
- Quellen- und Qualitätsstatus

## Zentrale Domänenobjekte

### ProductionGoal

Beschreibt ein gewünschtes Ergebnis:

- Berechnungsrichtung
- Zielprodukt oder Zielgebäude
- gewünschte Anzahl oder Warenmenge
- Ära
- Produktionsprofil
- optionaler Cluster

### CalculationMode

Unterstützte Richtungen:

- Endgebäude vollständig versorgen
- gewünschte Warenmenge produzieren
- vorhandenen Bestand prüfen
- maximale Produktion aus vorhandenen Rohstoffen bestimmen

### ChainRequirement

Ergebnis der rückwärts aufgelösten Produktionskette:

- Produktionsstufe
- rechnerischer Gebäudebedarf
- aufgerundete Bauempfehlung
- gebaut
- geplant
- fehlend oder überzählig
- theoretischer und erwarteter Output
- Arbeitskräftebedarf
- Überschuss oder Mangel

### UtilizationProfile

Bündelt bewusst unscharfe Annahmen:

- Arbeitszeitfaktor
- Logistikfaktor
- Berechnungsreserve
- Profilname und Vertrauensstufe

Vordefinierte Profile sind optimistisch, realistisch und schlechte Verkehrsanbindung. Benutzerdefinierte Werte bleiben möglich.

### Recommendation

Eine Empfehlung enthält:

- Priorität
- betroffene Entität
- Ursache
- konkrete Maßnahme
- Vertrauensstufe
- mögliche Navigation oder Aktion

## Berechnungspipeline

1. Produktionsziel validieren.
2. Zielrezept und Ära-Verfügbarkeit bestimmen.
3. Kette rekursiv bis zu Rohstoffquellen auflösen.
4. theoretischen Bedarf berechnen.
5. Gebäudebedarf auf ganze Gebäude aufrunden.
6. entstehenden Überschuss als Reserve berechnen.
7. Ist-Stand und geplanten Stand zuordnen.
8. Arbeitskräftebedarf ergänzen.
9. erwartete Produktion mit Auslastungsprofil berechnen.
10. Logistikrisiko und Vertrauensstufe ergänzen.
11. priorisierte Empfehlungen ableiten.

Die Pipeline bleibt unabhängig von der Darstellung. Tabellen-, Karten- und Flussansicht verwenden dieselben Ergebnisse.

## Geplant, gebaut und empfohlen

Die Zustände werden getrennt gespeichert und berechnet:

- gebaut gehört zum Ist-Stand
- geplant gehört zu einer Prognose oder einem Ausbauplan
- empfohlen ist ein abgeleitetes, nicht persistentes Berechnungsergebnis

Ein Berechnungsergebnis darf den Ist-Stand niemals automatisch verändern.

## Architekturprinzipien

- Berechnungslogik bleibt unabhängig von UI und Datenbank.
- Spieldaten und Nutzerdaten werden strikt getrennt.
- Module teilen ein gemeinsames Inselmodell, bleiben aber fachlich gekapselt.
- Alle Berechnungen müssen automatisiert testbar sein.
- Theoretische und erwartete Produktion werden getrennt.
- Unsichere Modelle liefern Vertrauensstufen statt Scheingenauigkeit.
- Ergebnis und Empfehlung werden vor Detailparametern dargestellt.
- Ein einfacher Modus ist vollständig nutzbar; Expertenfunktionen werden progressiv offengelegt.
- Nutzerdaten bleiben standardmäßig lokal.
- Exportformate werden versioniert.
- Migrationen werden von Anfang an berücksichtigt.
- Es gibt keine versteckten Annahmen in der Oberfläche.
- Medienreferenzen werden von Berechnungsdaten getrennt und rechtlich geprüft.

## Verweis

Die konkrete Informations-, Bildschirm- und Gestaltungsarchitektur ist in [Produkt- und UI-Zielarchitektur](16-produkt-und-ui-zielarchitektur.md) dokumentiert.
