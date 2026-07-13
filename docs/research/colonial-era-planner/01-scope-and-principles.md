# Umfang und Leitlinien

Stand: 13. Juli 2026

## Verbindlicher Umfang

Die erste fachlich vollständige Ausbaustufe behandelt ausschließlich die Kolonialzeit.

Enthalten sind:

- Grundspiel
- alle DLCs mit kolonialen Gebäuden
- DLC-Auswahl in den Einstellungen
- Produktion und Produktionsketten
- theoretische Warenlogistik
- Nahrungsproduktion
- theoretischer Nahrungsbedarf
- Nahrungsvielfalt
- Wohnkapazität
- Wohnqualität
- Mindestwohlstand
- Bau- und Bauplankosten von Wohngebäuden

Nicht enthalten sind:

- Wegfindung
- Straßenverkehr
- reale Fahrzeiten
- Arbeitswege
- Bedürfniswege
- dynamische Arbeiteranwesenheit
- exakte Lagerblockaden
- automatische Wohngebäudeempfehlungen
- spätere Zeitalter als Rechenumfang

Spätere Zeitalter dürfen in der Gebäudeauswahl sichtbar sein, solange nicht freigeschaltete Einträge klar deaktiviert sind.

## Leitlinie der Anwendung

Die bestehende direkte Bedienung bleibt das Fundament:

- Gebäude werden in einer übersichtlichen Liste verwaltet.
- Anzahl und Effizienz bleiben unmittelbar änderbar.
- Ergebnisse erscheinen direkt in derselben Zeile oder im zugehörigen Detail-Popover.
- Zusätzliche Fachmodule ergänzen den Hauptweg, ersetzen ihn aber nicht.
- Einstellungen bleiben außerhalb der täglichen Hauptbedienung.

Der Planer soll sich an der Zielorientierung etablierter Produktionsrechner orientieren, ohne zu einem technischen Netzwerkeditor zu werden.

## Datenqualitätsklassen

Jeder fachliche Wert erhält eine eindeutige Herkunft:

- `verified`: direkt aus einer belastbaren Gebäudetabelle oder Gebäudeseite
- `measured`: durch dokumentierten Spieltest gemessen
- `derived`: aus belegten oder gemessenen Werten berechnet
- `model`: bewusst gewählte, veränderbare Planungsannahme
- `unknown`: derzeit nicht belastbar bekannt

Ein Wert darf nicht allein deshalb als exakt erscheinen, weil er numerisch gespeichert werden kann.

## Zeiteinheit

### Gewünschte Anzeige

Die Hauptanzeige soll Werte pro Monat darstellen.

### Fachliche Einschränkung

Die beste öffentliche Produktionsquelle dokumentiert Mengen für jeden Tag, an dem ein Arbeiter das Gebäude besucht. Damit ist eine exakte Monatsproduktion ohne Anwesenheits- und Arbeitswegmodell nicht verfügbar.

### Empfohlene Lösung

- Kanonische Stammdateneinheit: Warenmenge je Arbeiter-Arbeitstag bei 100 Prozent Effizienz
- Kanonische Bestandsmenge: reale Warenbestands-Einheiten
- Anzeigeperiode: theoretischer Monat
- sichtbarer Modellparameter: `theoreticalWorkdaysPerMonth`
- empfohlener Startwert: 30, ausdrücklich als Modellannahme
- Tooltip zeigt immer den zugrunde liegenden Wert je Arbeiter-Arbeitstag

Der Monat ist damit eine verständliche Planungsperiode und keine Behauptung über die tatsächlich geleisteten Arbeitstage eines Tropicaners.

## Rechenebenen

Die Anwendung unterscheidet:

- maximale Gebäudekapazität bei vollständiger Besetzung
- konfigurierte theoretische Leistung mit eingetragener Besetzung
- tatsächliche Warenbilanz innerhalb des gewählten Szenarios
- Modellkapazität der Transportbüros

Arbeitszeit- und Logistikabschläge aus dem bisherigen erwarteten Modell werden für diese Ausbaustufe nicht auf die theoretische Produktion angewendet.

## DLC-Grundsatz

- Grundspiel ist immer aktiv.
- Jeder DLC kann einzeln aktiviert oder deaktiviert werden.
- Deaktivierte DLC-Gebäude bleiben in bestehenden Inselständen erhalten, werden aber als nicht verfügbar markiert.
- Neue Gebäude können nur aus aktivierten DLCs gewählt werden.
- Daten und Berechnungen dürfen niemals durch bloßes Deaktivieren eines DLCs stillschweigend gelöscht werden.
