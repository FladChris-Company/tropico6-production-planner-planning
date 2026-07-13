# Funktionsumfang

## Projekt- und Inselverwaltung

- Inselprojekt erstellen
- Inselprojekt umbenennen
- Inselprojekt duplizieren
- Inselprojekt archivieren
- Inselprojekt löschen
- Spielversion dokumentieren
- aktuelle Ära festlegen
- aktivierte DLCs auswählen
- Notizen hinterlegen

## Inselübersicht

- Status für Produktion, Bevölkerung, Arbeitskräfte und Logistik
- Anzahl relevanter Warnungen
- wichtigste Reserven und Engpässe
- priorisierte Empfehlungen
- direkte Navigation zur Ursache oder passenden Aktion
- lokale Speicherung sichtbar machen

## Produktionsziele

Unterstützte Berechnungsrichtungen:

- gewünschte Anzahl Endgebäude vollständig versorgen
- gewünschte Warenmenge produzieren
- vorhandenen Bestand auf versorgbare Endgebäude prüfen
- maximale Produktion aus vorhandenen Rohstoffen bestimmen

Eingaben:

- Ära
- Endprodukt oder Endgebäude
- gewünschte Anzahl oder Zielmenge
- Produktionsprofil
- optionaler Ziel-Cluster
- optional vorhandene Rohstoffgrenzen

Ergebnisse:

- vollständige rückwärts aufgelöste Produktionskette
- rechnerischer Gebäudebedarf
- auf ganze Gebäude aufgerundete Bauempfehlung
- entstehende Reserve aus der Aufrundung
- theoretische und erwartete Produktion
- Arbeitskräftebedarf
- Logistikhinweis
- konkrete nächste Maßnahme

## Zunächst unterstützte Hauptketten

- Kolonialzeit: Rum
- Weltkriege: Boote
- Kalter Krieg: Fahrzeuge
- Moderne: Elektronik

Weitere Ketten verwenden dieselbe allgemeine Rezept- und Abhängigkeitslogik.

## Geplant, gebaut und empfohlen

- empfohlenen Sollwert berechnen
- geplanten Ausbau separat erfassen
- tatsächlich gebauten Bestand separat erfassen
- Differenz je Gebäude und Produktionsstufe anzeigen
- Empfehlung vollständig oder teilweise in eine Prognose übernehmen
- geplante Gebäude Clustern zuweisen
- Planung bewusst in den Ist-Stand übernehmen

## Freie Cluster

Ein Cluster ist eine frei definierbare Gruppe von Gebäuden und keine feste Produktionskette.

- Cluster erstellen
- Cluster umbenennen
- Cluster duplizieren
- Cluster löschen
- Gebäude hinzufügen
- Gebäude entfernen
- Gebäude deaktivieren
- Gebäude in andere Cluster verschieben
- unterschiedliche Gebäudetypen kombinieren
- mehrere Produktionsketten in einem Cluster erlauben
- Produktionsketten über mehrere Cluster erlauben
- Empfehlungen einem vorhandenen oder neuen Cluster zuweisen

## Gebäudeeingabe

### Einfacher Modus

- Gebäude per Auswahl hinzufügen
- Anzahl mehrerer gleicher Gebäude erfassen
- durchschnittliche Effizienz eintragen
- gebaut oder geplant festlegen
- Produktionsprofil verwenden

### Erweiterter Modus

- Gebäude einzeln erfassen
- tatsächlich beschäftigte Arbeiter eintragen
- Arbeitsmodus auswählen
- Verbesserungen auswählen
- Entfernung und Logistikprofil festlegen
- individuelle Produktionswerte eintragen
- alternative Rohstoffquelle festlegen
- optionale Notiz

## Produktion

- Rohstoffproduktion berechnen
- Rohstoffverbrauch berechnen
- Warenproduktion berechnen
- Produktionskapazität berechnen
- theoretische Produktion berechnen
- erwartete Produktion mit Arbeitszeit- und Logistikfaktor berechnen
- Auslastung darstellen
- Überschuss und Fehlmenge anzeigen
- weiterverarbeitbare Menge anzeigen
- exportierbare Menge anzeigen
- Nebenprodukte berücksichtigen
- gemeinsame Zwischenprodukte verteilen
- Warenfluss innerhalb einer Produktionskette darstellen

## Bevölkerung und Versorgung

Späteres Fachmodul:

- Einwohner und Altersgruppen erfassen
- Ära und Wohlstandsverteilung berücksichtigen
- Sicherheitsreserve festlegen
- Touristen optional einbeziehen
- geschätzten Bedarf für Nahrung, Religion, Gesundheit, Unterhaltung und Einkauf bestimmen
- Kapazität des gebauten und geplanten Bestands bewerten
- qualitative Statuswerte statt Scheingenauigkeit ausgeben
- konkrete Versorgungsempfehlung erstellen

## Arbeitskräfte

- verfügbare Arbeitskräfte erfassen
- maximale Arbeitsplätze berechnen
- besetzte Arbeitsplätze berechnen
- offene Arbeitsplätze anzeigen
- fehlende Arbeiter erkennen
- Bildungsstufe berücksichtigen
- Arbeiterbedarf bei Prognosen berechnen
- Arbeiterbedarf pro Cluster und Produktionskette anzeigen
- verbleibende Reserve nach geplantem Ausbau ausgeben
- konkrete Aussagen zum fehlenden Bildungsniveau erzeugen

## Logistik

- Transportbedarf pro Cluster und Produktionskette schätzen
- vorhandene Fuhrunternehmen erfassen
- Entfernungen qualitativ berücksichtigen
- volle Ausgangslager berücksichtigen
- clusterübergreifende Transporte erkennen
- Logistikprofil verwenden
- Ergebnis als ausreichend, knapp, Risiko oder kritisch darstellen
- Ursache und Handlungsempfehlung ausgeben

Eine exakte Verkehrs- oder Wegfindungssimulation ist nicht vorgesehen.

## Lager und Reserven

- Anfangsbestand
- Mindestreserve
- Lagerkapazität
- gesperrte Waren
- Zeit bis Lager leer
- Zeit bis Lager voll
- Warenpriorität
- Restmenge für Export
- Reserve durch aufgerundete Gebäudeanzahl

## Prognosen und Meine Planung

- Prognose aus Ist-Stand erstellen
- Produktionsziel als Prognose speichern
- beliebig viele Prognosen
- Prognose duplizieren
- Prognose umbenennen
- Prognose löschen
- Gebäude hinzufügen oder entfernen
- Werte verändern
- Ist gegen Prognose vergleichen
- Prognosen gegeneinander vergleichen
- neue und behobene Engpässe anzeigen
- Prognose vollständig oder teilweise übernehmen
- empfohlene, geplante und gebaute Werte vergleichen

Ein separater Verlauf-Hauptbereich ist nicht vorgesehen. Historische Snapshots bleiben als unterstützende Funktion innerhalb der Planung erhalten.

## Diagnose und Empfehlungen

- Rohstoffmangel erkennen
- Transportproblem vermuten
- Arbeitermangel erkennen
- Anwesenheitsproblem vermuten
- volles Ausgangslager erkennen
- Exportstau erkennen
- unklare Ursache kennzeichnen
- Diagnose mit Begründung ausgeben
- Empfehlungen priorisieren
- konkrete Aktion oder Navigation anbieten
- Vertrauensstufe ausgeben

## Schnellprüfungen

- Kann eine weitere Fabrik versorgt werden?
- Welche Rohstoffgebäude werden für eine gewünschte Industrie benötigt?
- Wie viele Endfabriken kann mein Bestand realistisch versorgen?
- Welche Produktionsmenge ist mit meinen Rohstoffen maximal möglich?
- Welche Gebäude fehlen gegenüber der Empfehlung?
- Welche Arbeitskräfte benötigt der geplante Ausbau?
- Braucht ein Cluster wahrscheinlich mehr Fuhrunternehmen?
- Warum produziert ein Gebäude nicht?
- Ist ein Landwirtschaftscluster langfristig stabil?

## Datenaustausch

- automatisches lokales Speichern
- Projekt exportieren
- Projekt importieren
- vollständiges Backup exportieren
- vollständiges Backup importieren
- Schema- und Versionsprüfung
