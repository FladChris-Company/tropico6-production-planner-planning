# Produkt- und UI-Zielarchitektur

## Zielbild

Der Tropico-6-Planer wird als spielnahes Verwaltungswerkzeug konzipiert. Er soll weder wie eine Excel-Tabelle noch wie ein technischer Fabrikrechner wirken.

Die Anwendung beantwortet zuerst konkrete Spielerfragen:

- Was fehlt auf meiner Insel?
- Was kann mein aktueller Bestand versorgen?
- Was sollte ich als Nächstes bauen oder verbessern?
- Reichen Arbeitskräfte und Logistik für den geplanten Ausbau?

Berechnungstabellen und technische Annahmen liegen eine Ebene tiefer.

## Produktmodule

Die Anwendung wird fachlich in folgende Module gegliedert:

- Inselübersicht
- Produktion
- Bevölkerung und Versorgung
- Arbeitskräfte
- Logistik
- Meine Planung
- Einstellungen und Datenaustausch

Die Module teilen sich dieselben Insel-, Szenario-, Gebäude- und Stammdaten, bleiben aber fachlich und in der Präsentation getrennt.

## Informationsarchitektur

### Desktop

Der Desktopbereich besteht aus drei Zonen:

- linke Navigation: ungefähr 220 Pixel
- Hauptbereich: flexibel
- rechter Detailbereich: ungefähr 320 Pixel

Der rechte Detailbereich erscheint nur, wenn ein konkretes Objekt ausgewählt wurde. Dadurch bleibt der Hauptbereich ruhig und ergebnisorientiert.

### Mobile

Auf kleinen Bildschirmen werden die Zonen gestapelt:

- Navigation als kompakte Schublade oder untere Navigation
- Hauptinhalt als einspaltige Karten
- Detailbereich als eigener Bildschirm oder Vollbild-Dialog

Horizontale Tabellen und dauerhaft sichtbare Seitenleisten sind auf Mobilgeräten ausgeschlossen.

## Inselübersicht

Die Startseite zeigt keine Detailberechnungen, sondern eine kompakte Inselbewertung.

### Kopfzeile

- Inselauswahl
- aktuelle Ära
- Einwohner
- verfügbare oder arbeitslose Arbeitskräfte
- Anzahl relevanter Warnungen
- Speichern beziehungsweise lokalen Speicherstatus anzeigen

### Statuszeile

- Wirtschaft
- Arbeitskräfte
- Versorgung
- Logistik

Die Statuszeile verwendet verständliche Begriffe wie stabil, knapp, Mangel oder Risiko statt ungeklärter Prozentwerte.

### Hauptkarten

- Produktion
- Bevölkerung
- Arbeitskräfte
- Logistik

Jede Karte zeigt nur die wichtigsten Probleme, vorhandene Reserven und eine eindeutige Aktion zum Öffnen des Moduls.

### Empfehlungen

Der Bereich „Was sollte ich als Nächstes tun?“ ist der wichtigste Teil der Inselübersicht.

Eine Empfehlung enthält:

- Priorität
- konkrete Maßnahme
- verständliche Begründung
- direkte Aktion zum betroffenen Modul, Plan oder Gebäude

## Produktionsplanung

Die Produktionskette ist die Hauptansicht des Produktionsmoduls.

### Zielorientierte Planung

Der Spieler wählt:

- Berechnungsrichtung
- Endprodukt oder Endgebäude
- gewünschte Anzahl beziehungsweise Zielmenge
- Ära
- optional Produktionsprofil und Cluster

Unterstützte Berechnungsrichtungen:

- Endgebäude vollständig versorgen
- gewünschte Warenmenge produzieren
- vorhandenen Bestand prüfen
- maximale Produktion aus vorhandenen Rohstoffen bestimmen

### Zunächst unterstützte Hauptketten

- Kolonialzeit: Zucker → Rum
- Weltkriege: Holz → Bretter → Boote
- Kalter Krieg: Eisen und Kohle → Stahl sowie Kautschuk → Fahrzeuge
- Moderne: Öl → Kunststoff sowie Gold → Elektronik

Weitere Ketten werden über dieselbe deklarative Kettenstruktur ergänzt.

### Rückwärtsauflösung

Die Berechnung beginnt beim Ziel und löst die Abhängigkeiten bis zu den Rohstoffgebäuden rückwärts auf.

Für jede Stufe werden getrennt ausgegeben:

- rechnerischer Bedarf
- aufgerundete Bauempfehlung
- vorhandener Bestand
- geplanter Bestand
- fehlende oder überzählige Gebäude
- entstehender Produktionsüberschuss
- benötigte Arbeitskräfte
- Logistikhinweis

Gebäudeempfehlungen werden auf ganze Gebäude aufgerundet. Der dadurch entstehende Überschuss wird als Reserve ausgewiesen und nicht versteckt.

### Darstellung einer Kette

Eine Produktionskette wird als klarer Warenfluss dargestellt:

`Rohstoffgebäude → Zwischenprodukt → Verarbeitungsgebäude → Endprodukt → Abtransport`

Die Verbindungen zeigen:

- Warenname
- erwarteten Warenfluss
- benötigte Menge
- Überschuss oder Mangel

Tabellen bleiben eine optionale Detailansicht und sind nicht die Standarddarstellung.

## Geplant, gebaut und empfohlen

Diese drei Zustände werden fachlich und visuell getrennt:

- empfohlen: vom Rechner ermittelter Sollwert
- geplant: vom Spieler für den nächsten Ausbau vorgesehener Stand
- gebaut: tatsächlich auf der Insel vorhandener Stand

Die Differenz wird pro Gebäude, Produktionsstufe, Cluster und Gesamtplan berechnet.

Ein Produktionsziel verändert den Ist-Stand nicht automatisch. Es kann:

- als neue Prognose gespeichert werden
- ganz oder teilweise in einen Plan übernommen werden
- einem vorhandenen oder neuen Cluster zugeordnet werden
- später kontrolliert in den Ist-Stand übernommen werden

## Gebäudekarten und Detailbereich

Die Hauptansicht zeigt kompakte Gebäudekarten mit Ergebnis vor Eingabe.

Standardinhalt:

- Gebäude- oder Warenbild
- gebaut
- empfohlen
- geplant
- durchschnittliche Effizienz
- theoretischer Output
- erwarteter Output
- Status und konkrete Empfehlung

Nach Auswahl öffnet sich der rechte Detailbereich.

Dort können mehrere gleiche Gebäude zusammengefasst oder einzeln verwaltet werden:

- Effizienz
- besetzte und maximale Arbeitsplätze
- Arbeitsmodus
- Verbesserungen
- Arbeitswege
- Rohstoffabholung
- Berechnungsreserve
- Logistikprofil
- individuelle Produktionswerte

## Einfacher und erweiterter Modus

### Einfacher Modus

- Anzahl
- Effizienz
- gebaut, geplant und empfohlen
- theoretisches und erwartetes Ergebnis
- Status
- Handlungsempfehlung

### Erweiterter Modus

- einzelne Gebäude
- Arbeitsmodi und Verbesserungen
- Arbeitsplatzbesetzung
- Import- und Exportwerte
- Logistikreserve
- alternative Rohstoffquellen
- gemeinsame Nutzung von Zwischenprodukten
- manuelle Modellfaktoren

Der erweiterte Modus darf die erste Nutzung nicht blockieren.

## Theoretische und erwartete Produktion

Tropico arbeitet nicht mit dauerhaft perfekten Produktionsraten. Deshalb werden zwei Ebenen getrennt:

### Theoretisch

`Basisproduktion × Effizienz × Arbeitsplatzbesetzung`

Annahme: Rohstoffe, Arbeiter, Lager und Transport sind jederzeit verfügbar.

### Erwartet

`Theoretische Produktion × Arbeitszeitfaktor × Logistikfaktor`

Vordefinierte Profile:

- optimistisch
- realistisch
- schlechte Verkehrsanbindung
- benutzerdefiniert

Arbeitszeit- und Logistikfaktor sind Planungsannahmen und werden nicht als exakte Spielsimulation dargestellt.

## Bevölkerung und Versorgung

Das Modul berechnet später den geschätzten Versorgungsbedarf aus:

- Einwohnern
- Altersgruppen
- Ära
- Wohlstandsverteilung
- Sicherheitsreserve
- optional Touristen

Nicht exakt bestimmbare Werte werden qualitativ ausgegeben:

- ausreichend
- knapp
- wahrscheinlich überlastet
- nicht genügend Daten

Scheingenauigkeit wie „genau 102 Plätze fehlen“ wird vermieden, wenn das Spiel keine belastbare Grundlage liefert.

## Arbeitskräfte

Arbeitskräfte werden nach Bildungsstufe getrennt:

- ungelernt
- Oberschule
- Hochschule

Für Ist-Stand und Planung werden dargestellt:

- verfügbar
- benötigt
- offene Stellen
- verbleibende Reserve
- zusätzlicher Bedarf des geplanten Ausbaus

Empfehlungen werden als direkte Aussage formuliert, zum Beispiel: „Für diesen Ausbau fehlen voraussichtlich sechs Arbeiter mit Oberschulbildung.“

## Logistik

Logistik bleibt bewusst ein Schätzmodell und keine exakte Verkehrssimulation.

Berücksichtigt werden unter anderem:

- Anzahl und Entfernung der Gebäude
- Produktionsvolumen
- volles Ausgangslager
- vorhandene Fuhrunternehmen
- clusterübergreifende Transporte
- gewähltes Logistikprofil

Ergebnisse werden als ausreichend, knapp, Risiko oder kritisch dargestellt und mit einer Begründung versehen.

## Visuelle Gestaltung

### Farbpalette

- Hintergrund: `#F4E8CF` warmes Sandbeige
- Karten: `#FFF9ED` helles Creme
- Navigation: `#234F45` dunkles Tropengrün
- Primärfarbe: `#C94C32` Tropico-Rot
- Sekundärfarbe: `#D9A441` Goldgelb
- Positiv: `#3F7D55`
- Warnung: `#D4942A`
- Kritisch: `#B83A32`
- Text: `#2B2925`

Rot wird nur für wichtige Aktionen und tatsächliche Probleme verwendet.

### Stilregeln

- helle Arbeitsfläche statt vollständig dunkler Oberfläche
- warme Tropico-Farben
- Gebäude- und Warenbilder als Orientierung
- leichte Schatten statt vieler starker Rahmen
- Kartenradius von ungefähr 10 bis 12 Pixeln
- charaktervolle Überschriften, klare Sans-Serif-Schrift für Werte und Texte
- höchstens eine primäre Aktion pro Bereich
- Tabellen nur in Detailansichten
- Ergebnis zuerst, Einstellungen danach
- Grün nur für ausreichend
- Gelb für knapp
- Rot für tatsächlichen Mangel

## Technische Konsequenzen

Die Präsentation benötigt getrennte View-Modelle und Abfragen für:

- Inselübersicht
- Produktionskettenansicht
- Gebäude-Detailbereich
- Bevölkerung
- Arbeitskräfte
- Logistik
- Empfehlungen

Die Domäne stellt keine fertigen UI-Texte bereit. Sie liefert strukturierte Ergebnisse, Vertrauensstufen, Ursachen und Handlungsmöglichkeiten. Die Präsentationsschicht übersetzt diese in spielernahe Aussagen.

Bilder und Icons werden über versionierte Medienreferenzen in den Stammdaten zugeordnet. Rechte und zulässige Nutzung müssen vor einer öffentlichen Veröffentlichung geklärt sein.

## Nicht-Ziele

- technische Factorio-ähnliche Tabellen als Standardansicht
- vollständig dynamisches Netzwerkdiagramm als Hauptnavigation
- exakte Simulation von Wegfindung und Verkehr
- Scheingenauigkeit bei unzureichender Datenbasis
- automatische Änderung des Ist-Stands durch eine Berechnung
- dauerhafte Anzeige aller Detailoptionen
