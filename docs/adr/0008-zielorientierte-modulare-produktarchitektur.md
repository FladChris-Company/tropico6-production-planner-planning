# ADR-0008: Zielorientierte modulare Produktarchitektur

- Status: akzeptiert
- Datum: 2026-07-13

## Kontext

Untersuchte Rechner für Factorio, Satisfactory, Anno, Oxygen Not Included, Dyson Sphere Program und Timberborn zeigen unterschiedliche Stärken:

- technische Rückwärtsauflösung von Produktionsketten
- projektbezogene Fabrikpläne
- bevölkerungsgetriebener Bedarf
- direkt bearbeitbare Produktionsketten
- mehrere Berechnungsrichtungen
- integrierte Gebäude- und Wareninformationen

Tropico 6 unterscheidet sich von deterministischen Fabrikspielen. Produktion hängt zusätzlich von Effizienz, Arbeitsplatzbesetzung, Arbeiteranwesenheit, Wegen, Rohstoffverfügbarkeit, Lagerzuständen und Transport ab.

Eine reine Produktionsmathematik würde wichtige Spielerprobleme ignorieren. Eine vollständig integrierte Oberfläche mit allen Parametern wäre dagegen zu komplex.

## Entscheidung

Die Anwendung wird als modularer Inselplaner mit zielorientiertem Produktionskern aufgebaut.

Fachmodule:

- Inselübersicht
- Produktion
- Bevölkerung und Versorgung
- Arbeitskräfte
- Logistik
- Meine Planung

Der Produktionskern unterstützt mehrere Berechnungsrichtungen:

- Endgebäude versorgen
- Zielmenge produzieren
- Bestand prüfen
- Ressourcenlimit bestimmen

Produktionsziele werden rückwärts bis zu den Rohstoffquellen aufgelöst. Rechnerischer Bedarf und aufgerundete Bauempfehlung werden getrennt dargestellt. Überschüsse durch Aufrundung werden als Reserve ausgewiesen.

Theoretische und erwartete Produktion werden getrennt berechnet. Erwartungswerte verwenden verständliche Arbeitszeit- und Logistikprofile und werden als Schätzung mit Vertrauensstufe dargestellt.

Die Oberfläche zeigt Ergebnis und Handlungsempfehlung vor technischen Parametern. Ein einfacher Modus ist vollständig nutzbar. Erweiterte Einstellungen werden progressiv offengelegt.

Gebaut, geplant und empfohlen sind getrennte Zustände. Berechnungsergebnisse ändern den Ist-Stand nicht automatisch.

## UI-Entscheidung

Die Standardoberfläche orientiert sich stärker an spielnahen Anno-Rechnern als an technischen Factorio-Tabellen.

- Produktionsketten als Gebäudekarten und Warenfluss
- Tabellen nur als Detailansicht
- helle Tropico-Farbwelt
- linke Navigation, flexibler Hauptbereich und kontextbezogener rechter Detailbereich
- priorisierte Empfehlungen auf der Startseite
- kein Verlauf als eigener Hauptbereich

## Alternativen

### Reiner Produktionsketten-Rechner

Verworfen als Gesamtarchitektur, weil Arbeitskräfte, Bevölkerung und Logistik für Tropico wesentlich sind.

### Reiner Einwohnerbedarfs-Rechner

Verworfen, weil Produktionsketten, Effizienz und vorhandener Inselbestand zentrale Anwendungsfälle sind.

### Vollständig technische Fabrikoberfläche

Verworfen als Standardmodus, weil sie normale Tropico-Spieler überfordert und die spielerische Entscheidungsunterstützung schwächt.

### Exakte Logistiksimulation

Verworfen, weil belastbare Daten und vollständige Wegfindungsmechaniken fehlen. Stattdessen wird ein transparentes Schätzmodell verwendet.

## Folgen

Positiv:

- klare Spielerfragen als Einstieg
- dieselbe Domäne unterstützt einfache und fortgeschrittene Nutzung
- weitere Ären und Ketten sind deklarativ erweiterbar
- Bevölkerung, Arbeitskräfte und Logistik können schrittweise ergänzt werden
- Unsicherheit wird sichtbar statt verborgen

Negativ:

- mehr Domänenobjekte und View-Modelle
- Empfehlungen benötigen eine eigene Regel- und Priorisierungslogik
- Medien und UI-Zustände müssen sauber von Berechnungsdaten getrennt werden
- vollständige Tests benötigen Szenarien über mehrere Module

## Verweise

- [Technische Zielarchitektur](../04-technische-architektur.md)
- [Produktionsmodell](../07-produktionsmodell.md)
- [Bedienkonzept](../11-bedienkonzept.md)
- [Produkt- und UI-Zielarchitektur](../16-produkt-und-ui-zielarchitektur.md)
