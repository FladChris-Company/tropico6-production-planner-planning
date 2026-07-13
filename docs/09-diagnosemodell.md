# Diagnosemodell

## Ziel

Die Anwendung soll nicht nur Soll-Werte berechnen, sondern plausible Ursachen für reale Produktionsprobleme benennen.

## Mögliche Eingaben

- Eingangslagerbestand
- Ausgangslagerbestand
- Kapazitäten
- Hafenbestand
- beschäftigte Arbeiter
- im Spiel angezeigte Effizienz
- Lieferantenbestand
- Beobachtungszeitraum
- zwei oder mehr Messpunkte

## Diagnosetypen

- Rohstoffmangel
- Überproduktion
- zu geringe Verarbeitungskapazität
- Arbeitermangel
- Anwesenheitsproblem
- Transportverdacht
- Ausgangslager blockiert
- Exportstau
- Lagerkonflikt
- widersprüchliche Warenpriorität
- unklare Ursache

## Vertrauensstufen

- niedrig
- mittel
- hoch

Eine Diagnose darf nur dann als sicher formuliert werden, wenn die Eingaben sie eindeutig stützen. Ansonsten wird sie als Verdacht oder wahrscheinlichste Ursache ausgegeben.

## Beobachtungsmodus

Der Nutzer erfasst einen Start- und Endzustand.

Daraus können abgeleitet werden:

- beobachtete Produktionsrate
- beobachtete Verbrauchsrate
- beobachtete Abholrate
- Abweichung vom theoretischen Modell
- individueller Korrekturfaktor

## Handlungsorientierte Ausgabe

Jede Diagnose enthält:

- Problem
- Begründung
- betroffene Gebäude oder Cluster
- Vertrauensstufe
- konkrete nächste Prüfung
- mögliche Maßnahme
