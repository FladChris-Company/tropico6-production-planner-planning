# ADR-0010: Manuelle CSV-Dateien als Wissensquelle

- Status: akzeptiert
- Datum: 2026-07-14

## Kontext

Die neuen CSV-Dateien unter `manual/` enthalten den umfassendsten recherchierten Bestand zu Gebäuden, Waren, Rezepten, Arbeitsmodi und Quellen. Parallel gepflegte Werte in TypeScript führten zu abweichenden Namen, Einheiten und Datenstatus.

## Entscheidung

`manual/` ist die gepflegte Wissensquelle für Tropico-Stammdaten. Für den Kolonialzeit-MVP erzeugt ein validierter Generator daraus deterministische, typisierte Laufzeitdaten.

- Gebäude, Rezepte, Waren, Arbeitsmodi, belegte Verbesserungen und Quellen werden eingelesen.
- Nur koloniale Gebäude werden in die MVP-Laufzeitdaten übernommen.
- Plantagen, Ranches und Minen werden als spielernahe auswählbare Varianten ausgegeben.
- Gemessene Raten je Arbeiter-Arbeitstag werden mit Faktor 1.000 in Warenbestands-Einheiten normalisiert.
- Normierte Community-Schätzungen dürfen berechnet werden, wenn Quelle und Annahmen dokumentiert sind; sie bleiben als `estimated` sichtbar.
- Nicht normierte Testchargen und Produktionswege ohne Zeitrate bleiben für die Mengenberechnung `null`. Ihre Ein-/Ausgangswaren und Chargenverhältnisse werden dennoch angezeigt.
- Spätere Minenvarianten und nicht koloniale Arbeitsmodi werden im Kolonialzeit-MVP nicht angeboten.
- Verbesserungen werden nur übernommen, wenn sie einem kolonialen Gebäude zugeordnet, kein Platzhalter und in der Wissensquelle konkret befüllt sind.
- Die generierte JSON-Datei wird eingecheckt und in CI gegen die CSV-Quelle geprüft.

Weitere CSV-Dateien für Budgets, Wohnen und Sonderobjekte bleiben Wissensquelle, werden aber erst mit den entsprechenden Fachmodulen in Laufzeitmodelle überführt.

## Folgen

- Spieldaten werden nicht mehr parallel im Anwendungscode gepflegt.
- Änderungen an relevanten CSV-Dateien benötigen eine Neugenerierung.
- Quellenstatus und Datenlücken bleiben für Spieler sichtbar.
- Datenvalidierung und Fachtests schützen stabile IDs, Einheiten und bekannte Produktionsketten.
