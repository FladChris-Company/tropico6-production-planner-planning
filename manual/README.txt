Tropico 6 – Gebäudedaten
Erstellt: 2026-07-13
Kodierung: UTF-8 mit BOM
Trennzeichen: Semikolon

DATEIEN
- gebaeude.csv
  234 reguläre Gebäude und Gebäudemodule mit Zeitalter, Kategorie, DLC,
  Kosten, Strom, Arbeitsplätzen, Bildung, Größen sowie den jeweils
  verfügbaren Wohn-, Besucher- und Qualitätswerten.

- produktionsrezepte.csv
  Produktionsvarianten mit Eingangs- und Ausgangsmengen.
  Die 94 Grundspiel-Messwerte stammen aus Community-Messungen und sind
  als Mengen je Arbeiter und Arbeitstag bei 100 % Effizienz erfasst.
  Vier Spielzeugfabrik-Werte sind separate Testchargen und nicht direkt
  mit den übrigen Messwerten vergleichbar.
  Für 18 Produktionsgebäude ohne belastbare öffentliche Messwerte sind
  ausdrücklich gekennzeichnete Platzhalter vorhanden.

- arbeitsmodi.csv
  Aus den bekannten Produktionsvarianten abgeleitete Arbeitsmodi.
  Nicht-produktive Arbeitsmodi und viele DLC-Modi sind öffentlich nicht
  in einer vollständigen Gesamttabelle dokumentiert.

- verbesserungen.csv
  Jedes Gebäude ist als Abdeckungszeile enthalten.
  Drei Verbesserungen der Spielzeugfabrik sind konkret befüllt.
  Nicht recherchierte Werte sind als Platzhalter markiert und wurden
  nicht erfunden.

- budgetstufen.csv
  Jedes Gebäude ist als Abdeckungszeile enthalten.
  Die fünf dokumentierten Budgetstufen der Spielzeugfabrik sind befüllt.
  Für die übrigen Gebäude fehlen in den verwendeten Quellen vollständige
  Gesamtdaten.

- waren.csv
  Waren aus den vorhandenen Produktionsrezepten.

- sonderobjekte.csv
  Straße, Abrisswerkzeug, nicht baubare Hütte, Dekorationen und Weltwunder.

- quellen.csv
  Verwendete Quellen und Einschätzung der Datenqualität.

- datenabdeckung.csv
  Übersicht über Vollständigkeit und bekannte Einschränkungen.

- alle_gebaeudedaten.csv
  Zusammengeführte Gebäudegrunddaten mit einer Übersicht der vorhandenen
  Rezept-, Arbeitsmodus-, Verbesserungs- und Budgetabdeckung.

WICHTIGE DATENSTATUS-WERTE
- verified_wiki_table:
  Wert aus der vollständigen Gebäudetabelle der Tropico-Wiki.
- measured_community:
  Empirischer Produktionswert aus einer Community-Messung.
- measured_community_batch:
  Empirische Testcharge; nicht je Arbeiter und Arbeitstag.
- unknown_not_publicly_documented:
  Kein belastbarer Wert in den verwendeten öffentlichen Quellen.
- not_yet_researched:
  Platzhalter zur vollständigen Gebäudeabdeckung.

EINSCHRÄNKUNGEN
- Die deutschen Namen wurden aus der erstellten deutschen Gebäudeliste
  übernommen. Sie wurden nicht vollständig gegen aktuelle interne
  Lokalisierungsdateien des Spiels abgeglichen.
- Eine vollständige öffentliche Quelle für sämtliche Verbesserungen,
  Budgetstufen und DLC-Produktionsraten wurde nicht gefunden.
- Unbekannte Daten wurden bewusst leer gelassen und gekennzeichnet.

VERWENDUNG IN DER ANWENDUNG
- Dieser Ordner ist die gepflegte Wissensquelle für die Tropico-6-Stammdaten.
- Der Kolonialzeit-MVP verwendet derzeit gebaeude.csv, produktionsrezepte.csv,
  waren.csv, arbeitsmodi.csv und quellen.csv für die Laufzeitdaten.
- Änderungen werden mit `npm run data:generate` in die generierte JSON-Datei
  übertragen und mit `npm run data:check` auf Aktualität geprüft.
- Die Datei src/lib/domain/generated/colonial-data.json wird nicht manuell
  bearbeitet.
- Gemessene Ratenpunkte je Arbeiter-Arbeitstag werden mit 1.000 in sichtbare
  Warenbestands-Einheiten umgerechnet.
- Testchargen ohne normierte Zeitbasis und unbekannte Werte bleiben
  unberechenbar; sie werden nicht als Nullproduktion behandelt.
