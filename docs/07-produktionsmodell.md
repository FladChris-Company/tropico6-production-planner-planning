# Produktionsmodell

## Ziel

Das Modell trennt theoretische Kapazität, erwartete Produktion und beobachtete Realität. Es unterstützt mehrere Berechnungsrichtungen und löst Produktionsziele rückwärts bis zu den benötigten Rohstoffgebäuden auf.

## Berechnungsrichtungen

### Endgebäude versorgen

Beispiel: Fünf Rumdestillerien vollständig versorgen.

Das Modell berechnet alle vorgelagerten Gebäude, Warenflüsse, Arbeitskräfte und Reserven.

### Zielmenge produzieren

Beispiel: Eine gewünschte Menge Rum pro Arbeitstag oder Jahr erzeugen.

Das Modell ermittelt die benötigten Endgebäude und löst anschließend die vollständige Kette auf.

### Bestand prüfen

Beispiel: Aus vier Zuckerplantagen ableiten, wie viele Rumdestillerien theoretisch und realistisch versorgt werden können.

### Ressourcenlimit

Beispiel: Mit vorhandenen Rohstoffen die maximal mögliche Endproduktion bestimmen.

## Zunächst vorgesehene Hauptketten

- Kolonialzeit: Zucker → Rum
- Weltkriege: Holz → Bretter → Boote
- Kalter Krieg: Eisen und Kohle → Stahl sowie Kautschuk → Fahrzeuge
- Moderne: Öl → Kunststoff sowie Gold → Elektronik

Die Ketten werden deklarativ aus Rezepten und Warenbeziehungen aufgebaut. Neue Produktionsketten benötigen keine eigene Berechnungsimplementierung.

## Eingangsgrößen

- Berechnungsrichtung
- Zielprodukt oder Zielgebäude
- gewünschte Anzahl oder Zielmenge
- Gebäudetyp und Anzahl
- Basisausstoß
- Basisverbrauch
- Effizienz
- Beschäftigungsgrad
- Arbeitsmodus
- Verbesserungen
- Rohstoffverfügbarkeit
- optionale externe Versorgung
- Arbeitszeitfaktor
- Logistikfaktor
- Berechnungsreserve
- optionale Nachhaltigkeitsfaktoren

## Ausgaben

- theoretische Produktion
- erwartete Produktion
- theoretischer Verbrauch
- erwarteter Verbrauch
- verfügbare Rohstoffmenge
- Auslastung
- Überschuss
- Fehlmenge
- weiterverarbeitbare Menge
- exportierbare Restmenge
- rechnerischer Gebäudebedarf
- aufgerundete Bauempfehlung
- gebaut, geplant und empfohlen
- benötigte Arbeitskräfte
- Logistikrisiko
- Vertrauensstufe
- priorisierte Handlungsempfehlung

## Rückwärtsauflösung

1. Zielrezept bestimmen.
2. erforderliche Endproduktion oder Endgebäudeanzahl berechnen.
3. Eingangsbedarf jeder Produktionsstufe bestimmen.
4. Abhängigkeiten rekursiv bis zu Rohstoffquellen auflösen.
5. rechnerischen Gebäudebedarf bestimmen.
6. Bauempfehlung auf ganze Gebäude aufrunden.
7. durch Aufrundung entstehenden Überschuss als Reserve ausweisen.
8. vorhandenen und geplanten Bestand anrechnen.
9. Arbeitskräfte und Logistikfolgen ergänzen.

Zyklische Rezeptabhängigkeiten müssen bei der Stammdatenvalidierung verhindert oder ausdrücklich modelliert werden.

## Aufrundung

Gebäude können nur als ganze Einheiten gebaut werden.

Deshalb werden getrennt angezeigt:

- rechnerischer Bedarf, beispielsweise 3,4 Zuckerplantagen
- Bauempfehlung, beispielsweise 4 Zuckerplantagen
- Reserve aus der Aufrundung

Die Reserve wird in Gebäudeleistung und Warenmenge dargestellt.

## Theoretische Produktion

Grundformel:

`theoretisch = Basisproduktion × Effizienz × Beschäftigungsgrad`

Die theoretische Ebene nimmt an:

- Arbeiter sind während der möglichen Arbeitszeit anwesend
- Eingangsrohstoffe sind verfügbar
- Ausgangslager blockiert nicht
- Transport erfolgt rechtzeitig

## Erwartete Produktion

Grundformel:

`erwartet = theoretisch × Arbeitszeitfaktor × Logistikfaktor`

Diese Faktoren sind bewusst als Planungsschätzung modelliert.

Vordefinierte Profile:

- optimistisch
- realistisch
- schlechte Verkehrsanbindung
- benutzerdefiniert

Jedes Profil enthält:

- Arbeitszeitfaktor
- Logistikfaktor
- Berechnungsreserve
- Beschreibung
- Vertrauensstufe

## Beobachtete Realität

Später erfasste Beobachtungswerte können theoretische und erwartete Werte kalibrieren, ersetzen aber nicht automatisch die Stammdaten.

Beispiele:

- tatsächlich erzeugte Warenmenge
- häufig volles Ausgangslager
- fehlende Rohstoffe
- geringe Arbeiteranwesenheit
- lange Abholzeiten

## Berechnungsebenen

- Einzelgebäude
- Gebäudegruppe
- Cluster
- Produktionskette
- Ausbauplan beziehungsweise Prognose
- gesamte Insel

## Geplant, gebaut und empfohlen

- gebaut ist persistenter Bestandteil des Ist-Stands
- geplant ist persistenter Bestandteil einer Prognose
- empfohlen ist ein abgeleitetes Berechnungsergebnis

Die Differenz wird für jede Produktionsstufe berechnet.

## Einfache und erweiterte Eingabe

### Einfach

Der Nutzer trägt Anzahl und durchschnittliche Effizienz ein. Beschäftigung sowie Arbeitszeit und Logistik stammen aus verständlichen Profilen.

### Erweitert

Die Anwendung berücksichtigt:

- einzelne Gebäude
- Arbeitsplatzbesetzung
- Arbeitsmodus
- Verbesserungen
- individuelle Produktionswerte
- alternative Rohstoffquellen
- externe Versorgung
- manuelle Arbeitszeit- und Logistikfaktoren

Ein manuell eingegebener Gesamtwert kann die Modellrechnung überschreiben und wird als Nutzerwert gekennzeichnet.

## Warenverteilung

Unterstützte Strategien:

- automatische Bedarfsdeckung
- Priorität nach Empfänger
- feste Menge
- prozentuale Verteilung
- Mindestreserve
- Restmenge exportieren
- Restmenge lagern

Gemeinsam genutzte Zwischenprodukte müssen über eine explizite Verteilungsstrategie mehreren Produktionsketten zugeordnet werden.

## Unsicherheit

Produktionswerte können durch Spielversion, Arbeiteranwesenheit, Wegfindung, Lagerzustände und nicht vollständig dokumentierte Mechaniken abweichen.

Deshalb erhält jeder Stammdatenwert einen Qualitätsstatus. Ergebnisse mit unsicheren Annahmen zeigen eine Vertrauensstufe und vermeiden vermeintliche Exaktheit.
