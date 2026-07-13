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

## Modell der Kolonialzeit

Der Transportbedarf ist die Summe aller tatsächlich erzeugten Waren plus Importe. Jede Produktionsstufe wird einmal gezählt. Eingänge einer Fabrik werden nicht erneut addiert, wenn sie bereits als Ausgabe des vorherigen Gebäudes enthalten sind.

Die theoretische Kapazität eines Transportbüros lautet:

`besetzte Stellen × 500 Ladung je Fahrt × Effizienz × Arbeitsmodusfaktor × Fahrten je Arbeiter`

- 6 Stellen pro Transportbüro in der Kolonialzeit
- 500 Einheiten je Fahrt und Arbeiter
- Sichere Ladung: Faktor 1,00
- Lockere Ladegrenzen: konservativer Faktor 1,35 inklusive möglichem Frachtverlust
- Standardannahme: 2 Fahrten je Arbeiter und Standardarbeitsschicht

Die Fahrtenzahl ist keine dokumentierte Spielkonstante, sondern eine sichtbare Modellannahme. Ein voll besetztes Transportbüro mit 100 % Effizienz und sicherer Ladung erreicht damit theoretisch 6.000 Einheiten.

## Ausgabe

- theoretisch zu transportierende Menge
- theoretisch transportierbare Menge
- Differenz als Reserve oder Defizit
- Empfehlung, wie viele Transportbüros mehr oder weniger nötig sind
- Tooltip mit Formel, Annahmen und Abweichungsgründen

Alle Werte sind Näherungen. Reale Abweichungen entstehen insbesondere durch Entfernung, Verkehr, Rückwege, Wohnort, Bedürfnisse, Abwesenheiten, Besetzung und unterschiedliche Arbeitsmodi.

## Spätere Kalibrierung durch Spielerwerte

Die Architektur soll später untersuchen, welche einfach ablesbaren Spielwerte der Spieler liefern kann, um die Fahrtenannahme und damit die Näherung zu verbessern. Kandidaten sind beobachtete Liefermengen in einem festen Zeitraum, Fahrtdauer, typische Streckenlänge, Besetzung, Effizienz, Arbeitsmodus, volle Ausgangslager und Leerlaufzeiten. Diese Werte bleiben von den unveränderlichen Stammdaten getrennt.

## Diagnoseindikatoren

- Lieferant voll, Empfänger leer: Transportproblem wahrscheinlich
- Ausgangslager dauerhaft voll: Abtransportproblem wahrscheinlich
- Hafen leer, Produktion voll: Transport zum Hafen problematisch
- Rohstofferzeuger leer, Fabrik leer: Rohstoffproduktion wahrscheinlich zu gering
