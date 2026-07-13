# Quellenregister und offene Daten

Stand: 13. Juli 2026

## Bewertungsprinzip

Die Recherche unterscheidet zwischen:

- offizieller technischer Dokumentation
- strukturierter Community-Wiki
- reproduzierbarer Community-Messung
- Einzelbeobachtung oder Kommentar
- mathematischer Ableitung
- frei wählbarer Modellannahme

Eine Quelle kann für Gebäudekosten brauchbar und für Produktionsraten ungeeignet sein. Die Bewertung erfolgt deshalb je Wert, nicht pauschal je Website.

## Quellenregister

### Bestehendes Repository

#### README und Produktdokumentation

- Repository: `FladChris-Company/tropico6-production-planner-planning`
- relevante Dateien:
  - `README.md`
  - `docs/07-produktionsmodell.md`
  - `docs/08-logistik-und-transport.md`
  - `docs/16-produkt-und-ui-zielarchitektur.md`
- Verwendung:
  - bestehende Produktlinie
  - UI-Grundsätze
  - aktuelle Modellannahmen
  - Abgrenzung theoretisch und erwartet
- Vertrauensstufe: maßgeblich für Projektentscheidungen

#### Anwendungscode

- `src/lib/components/Planner.svelte`
- `src/lib/domain/core.ts`
- `src/lib/domain/data.ts`
- `src/lib/domain/types.ts`
- `src/lib/domain/storage.ts`
- `src/lib/domain/workforce-data.ts`
- Verwendung:
  - Analyse des Ist-Zustands
  - technische Machbarkeit
  - Daten- und Berechnungslücken
- Vertrauensstufe: maßgeblich für aktuellen Implementierungsstand

### Tropico-Wiki: vollständige Gebäudetabelle

- URL: `https://tropico.fandom.com/wiki/Buildings_(Tropico_6)`
- Verwendung:
  - Gebäude
  - Ären
  - DLC-Zuordnung über Fußnoten
  - Bauplankosten
  - Baukosten
  - Arbeiterstellen
  - Bildung
  - Größe
  - Wohnplätze
  - Wohnqualität
  - Mindestwohlstand
- Vertrauensstufe: mittel bis hoch für statische Grundwerte
- Einschränkung:
  - Community-Inhalt
  - einzelne Werte widersprechen Einzelseiten
  - nicht alle Arbeitsmodi und Verbesserungen enthalten

### Tropico-Wiki: Waren

- URL: `https://tropico.fandom.com/wiki/Goods_(Tropico_6)`
- Verwendung:
  - Warenkategorien
  - Nahrung
  - Konsumgüter
  - Luxusgüter
  - Quellen und Verwendungen
  - Ära
  - Basispreise
- Vertrauensstufe: mittel bis hoch für Klassifikation und Beziehungen

Wichtigster Befund für Nahrung:

- Bananen, Kokosnüsse, Mais, Fisch, Fleisch, Milch, Ananas und Schalentiere sind in der Kolonialzeit als Nahrung klassifiziert.

### Tropico-Wiki: Lebensmittelladen

- URL: `https://tropico.fandom.com/wiki/Grocery_(Tropico_6)`
- Verwendung:
  - Baukosten
  - Arbeitsplätze
  - Besucherplätze
  - Servicequalität
  - Mindestwohlstand
  - Wirkung von Nahrungsvielfalt
- Vertrauensstufe: mittel
- offene Lücke:
  - keine exakte Formel für Vielfalt zu Servicequalität
  - kein Monatsdurchsatz

### Tropico-Wiki: Plantage

- URL: `https://tropico.fandom.com/wiki/Plantation_(Tropico_6)`
- Verwendung:
  - Baukosten
  - Arbeitsplätze
  - Feldfrüchte
  - Multikultur
  - Reichweite
  - Verbesserungen
- Vertrauensstufe: mittel

Belastbare Multikulturangaben:

- 40 Prozent Effizienzabzug
- 10 Prozent Effizienz je anderer geeigneter Feldfrucht
- ungefähr 13 bis 14 Felder Reichweite

### Tropico-Wiki: Miststreuer

- URL: `https://tropico.fandom.com/wiki/Manure_Spreader`
- Verwendung:
  - Kosten
  - Arbeiter
  - Mistlager
  - Arbeitsmodi
  - Reichweite
  - Verbesserungen
- Vertrauensstufe: mittel
- offene Lücke:
  - keine vollständige Umrechnung der Bodenregeneration in Monatsproduktion

### Tropico-Wiki: Wohngebäude

- `https://tropico.fandom.com/wiki/Country_House_(Tropico_6)`
- `https://tropico.fandom.com/wiki/Bunkhouse_(Tropico_6)`
- `https://tropico.fandom.com/wiki/Mansion_(Tropico_6)`
- `https://tropico.fandom.com/wiki/Residential_Boat`
- `https://tropico.fandom.com/wiki/Tree_House`
- `https://tropico.fandom.com/wiki/Shack_(Tropico_6)`
- Verwendung:
  - Arbeitsmodi
  - Budgetwerte
  - Haushaltsplätze
  - Mindestwohlstand
  - Wohnqualität
- Vertrauensstufe: mittel
- Einschränkung:
  - Bauplankosten widersprechen teilweise der Gesamttabelle

### Steam-Guide: Industry Profits

- URL: `https://steamcommunity.com/sharedfiles/filedetails/?id=1720095953`
- veröffentlicht: 23. April 2019
- zuletzt aktualisiert: 27. April 2019
- Verwendung:
  - Produktions- und Verbrauchsraten
  - Messbasis je Arbeiter-Arbeitstag
  - 100 Prozent Effizienz
  - Grundspiel-Produktionsgebäude
- Vertrauensstufe: mittel bis hoch als dokumentierte Community-Messung
- keine offizielle Spielkonstante

Wichtiger Methodenhinweis der Quelle:

- Die Werte gelten für jeden Tag, an dem ein Arbeiter das Gebäude besucht.
- Die Werte wurden bei 100 Prozent Effizienz ermittelt.

Wichtige Ableitung:

- Die Profitformeln zeigen, dass ein Ratenpunkt 1.000 Warenbestands-Einheiten repräsentiert.
- Diese Skalierung ist eine mathematische Ableitung aus den angegebenen Mengen, Preisen und Gewinnen.

### Kommentare zum Steam-Guide

- Verwendung:
  - Return-to-Nature-Raten
  - Perlentaucher
  - Imkerei
- Vertrauensstufe: niedrig bis mittel
- Grund:
  - einzelne Community-Kommentare
  - nicht Teil der ursprünglichen einheitlichen Testreihe
  - mögliche Versionsunterschiede

Diese Werte erhalten einen eigenen Status und dürfen nicht wie die ursprünglichen Guide-Werte behandelt werden.

### Svelte-Dokumentation

- URL: `https://svelte.dev/docs/svelte/$state`
- URL: `https://svelte.dev/docs/svelte/$derived`
- Verwendung:
  - reaktive Zustände
  - abgeleitete Filter- und Gruppierungsdaten
- Vertrauensstufe: hoch
- Quelle: offizielle technische Dokumentation

### WAI-ARIA Authoring Practices

- URL: `https://www.w3.org/WAI/ARIA/apg/patterns/combobox/`
- URL: `https://www.w3.org/WAI/ARIA/apg/patterns/menubar/`
- Verwendung:
  - Tastatursteuerung der Suchauswahl
  - Rollen und Zustände
  - verschachtelte Untermenüs
  - Fokusführung
- Vertrauensstufe: hoch
- Quelle: W3C/WAI

### Vergleichbare Produktionsrechner

#### Anno-Rechner

- Beispiel: `https://anno1800.fandom.com/wiki/Anno_1800_Needs_Calculators_Overview`
- Verwendung:
  - Einwohner- und Bedarfsorientierung
  - Werte pro Minute oder Zeiteinheit
  - Trennung von Bevölkerung und Produktion

#### FactorioLab

- URL: `https://factoriolab.github.io/`
- Verwendung:
  - zielorientierte Rückwärtsrechnung
  - deklarative Rezepte
  - Aufrundung und Überschuss
  - alternative Produzenten

#### Satisfactory Calculator

- URL: `https://satisfactory-calculator.com/en/planners/production`
- Verwendung:
  - Zielmenge pro Minute
  - Netzwerk-, Baum-, Waren- und Gebäudeansicht
  - unterschiedliche Sichten auf dieselbe Berechnung

Die Vergleichstools liefern UI- und Architekturideen, keine Tropico-Spieldaten.

## Offene Daten mit hoher Priorität

### Produktionsraten Grundspiel

- Holzfällerlager
- Kokosnussernter
- Fischereihafen: Fisch
- Fischereihafen: Schalentiere

Diese Werte blockieren vollständige Produktions-, Nahrungs- und Logistikbilanzen.

### Produktionsraten DLC

- Spielzeugfabrik je kolonialem Arbeitsmodus
- Feuerwerksfabrik je kolonialem Arbeitsmodus
- Verifizierung von Köhlerei, Papiermühle, Druckerei und Imkerei
- Verifizierung Perlentaucher einschließlich Arbeiterzahl

### Nahrung

- Verbrauch je Einwohner und Monat
- Einfluss einzelner Nahrungsarten auf Servicequalität
- Durchsatz des Lebensmittelladens
- Besuchshäufigkeit und Besuchsdauer
- Verhältnis Besucher zu versorgten Haushalten

### Wohnen

- verifizierte deutsche Namen aus aktueller Lokalisierung
- widersprüchliche Bauplankosten
- vollständige Budget- und Mietwerte
- Ära einzelner Verbesserungen

### Logistik

- offiziell bestätigte Ladung je Teamster und Ära
- reale Fahrten je Arbeiter-Arbeitstag
- genaue Wirkung lockerer Ladegrenzen
- Transporthafen-Kapazität
- Hafen-Umschlagkapazität

Die aktuelle Fahrtenzahl bleibt deshalb Modellparameter.

### Unterstützungsgebäude

- exakte Produktionswirkung des Miststreuers
- Mistproduktion der Ranch-Arbeitsmodi
- Wirkung des künstlichen Korallenriffs auf einzelne Wassergebäude
- Reichweiten- und Stapelregeln weiterer Unterstützungen

## Vorgeschlagene Reihenfolge weiterer Datenerhebung

- fehlende Grundspiel-Rohstoffraten messen
- Einheitenskala im Spiel anhand Lageränderungen verifizieren
- Spielzeugfabrik und Feuerwerksfabrik normiert messen
- DLC-Raten aus Return to Nature wiederholen
- Nahrungsverbrauch in kontrolliertem Szenario messen
- Lebensmittelladen-Durchsatz untersuchen
- Wohnbaupläne und deutsche Namen direkt im aktuellen Spiel abgleichen
- Teamster-Fahrten und Ladung unter kontrollierten Bedingungen messen

## Anforderungen an einen Messversuch

Jeder neue Messwert dokumentiert:

- Spielversion
- Plattform
- DLCs
- Schwierigkeitsgrad, falls relevant
- Gebäude
- Arbeitsmodus
- Verbesserungen
- Budget
- Effizienz
- Arbeiterzahl
- Messdauer
- Anfangs- und Endbestand
- Eingangs- und Ausgangsmenge
- Anzahl tatsächlicher Arbeiterbesuche
- mindestens drei Wiederholungen
- Mittelwert und Streuung

## Umgang mit Datenlücken in der UI

- unbekannte Werte bleiben leer
- unbekannt ist nicht null
- betroffene Berechnungen werden als unvollständig markiert
- Nutzer kann einen lokalen Überschreibungswert eintragen
- Überschreibung erhält Status `Nutzerwert`
- Quellenstatus bleibt sichtbar
- Zielberechnung überspringt keine fehlende Stufe ohne Warnung

## Quellenpflege im Repository

Empfohlene Stammdatenfelder:

- `sourceId`
- `title`
- `url`
- `retrievedAt`
- `sourceType`
- `reliability`
- `notes`

Jeder einzelne Zahlenwert kann mehrere Quellen referenzieren.
