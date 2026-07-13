# Logistik und Transport

## Ziel

Transport wird als Schätzmodell behandelt, nicht als exakte Simulation der Tropico-Wegfindung.

## Zu berücksichtigende Faktoren

- Warenmenge
- Anzahl produzierender Gebäude
- Anzahl Verarbeitungsschritte
- Anzahl Abholstellen
- Anzahl Zielgebäude
- clusterinterner Transport
- clusterübergreifender Transport
- Entfernung zum nächsten Verarbeitungsschritt
- Entfernung zum Hafen
- vorhandene Transportbüros
- besetzte Arbeitsplätze in Transportbüros
- Lagerzustände

## Optionale Entfernung

Eine leere Entfernung wird nicht berücksichtigt.

Mögliche spätere Eingabeformen:

- Kategorie: nah, mittel, weit
- geschätzte Fahrzeit
- frei definierter Zahlenwert

Die endgültige Form ist noch offen.

## Trennung zweier Entfernungen

### Warenentfernung

Beeinflusst Transportbelastung.

### Arbeiterentfernung

Beeinflusst erwartbare Anwesenheit und reale Produktion.

## Ausgabe

Kein scheingenauer Einzelwert.

Stattdessen:

- Mindestbedarf
- empfohlener Bereich
- Sicherheitsreserve
- aktueller Bestand
- Status
- Vertrauensstufe
- Begründung

## Diagnoseindikatoren

- Lieferant voll, Empfänger leer: Transportproblem wahrscheinlich
- Ausgangslager dauerhaft voll: Abtransportproblem wahrscheinlich
- Hafen leer, Produktion voll: Transport zum Hafen problematisch
- Rohstofferzeuger leer, Fabrik leer: Rohstoffproduktion wahrscheinlich zu gering
