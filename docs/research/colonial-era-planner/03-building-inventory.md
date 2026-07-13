# Gebäudeinventar Kolonialzeit

Stand: 13. Juli 2026

## Zweck

Dieses Inventar enthält alle kolonialen Gebäude, die für Produktion, theoretische Logistik, Nahrung oder Wohnen relevant sind. Gebäude aus anderen Bereichen können weiterhin als Arbeitsplätze erfasst werden, sind aber kein Teil der ersten fachlichen Berechnung.

## Modellierungsgrundsatz für Varianten

Im Spiel sind Plantage, Ranch und Mine jeweils ein Gebäudetyp mit gewählter Ware beziehungsweise Tierart. Für die Bedienung darf der Planer weiterhin konkrete Einträge wie `Zuckerplantage` oder `Rinderfarm` anbieten. Intern sollte jedoch eine gemeinsame Stammdatenstruktur verwendet werden:

- Stammgebäude
- auswählbare Variante
- Arbeitsmodus
- freigeschaltete Ära
- Ein- und Ausgänge

Damit bleibt die aktuelle direkte Auswahl erhalten, während Daten nicht mehrfach gepflegt werden müssen.

## Rohstoff- und Nahrungsproduktion im Grundspiel

| Auswahl im Planer | Stammgebäude | Arbeiter | Baukosten | Ausgabe | Nahrung |
|---|---|---:|---:|---|---|
| Bananenplantage | Plantage | 8 | 1.500 $ | Bananen | ja |
| Kakaoplantage | Plantage | 8 | 1.500 $ | Kakao | nein |
| Kaffeeplantage | Plantage | 8 | 1.500 $ | Kaffee | nein |
| Maisplantage | Plantage | 8 | 1.500 $ | Mais | ja |
| Baumwollplantage | Plantage | 8 | 1.500 $ | Baumwolle | nein |
| Ananasplantage | Plantage | 8 | 1.500 $ | Ananas | ja |
| Kautschukplantage | Plantage | 8 | 1.500 $ | Kautschuk | nein |
| Zuckerplantage | Plantage | 8 | 1.500 $ | Zucker | nein |
| Tabakplantage | Plantage | 8 | 1.500 $ | Tabak | nein |
| Rinderfarm | Ranch | 4 | 900 $ | Fleisch und Häute | Fleisch ja |
| Schaffarm | Ranch | 4 | 900 $ | Wolle und Milch | Milch ja |
| Krokodilfarm | Ranch | 4 | 900 $ | Leder | nein |
| Schweinefarm | Ranch | 4 | 900 $ | Fleisch | ja |
| Lamafarm | Ranch | 4 | 900 $ | Wolle | nein |
| Ziegenfarm | Ranch | 4 | 900 $ | Milch | ja |
| Kokosnussernter | Kokosnussernter | 6 | 800 $ | Kokosnüsse | ja |
| Holzfällerlager | Holzfällerlager | 6 | 750 $ | Holzstämme | nein |
| Fischereihafen: Fisch | Fischereihafen | 5 | 1.200 $ | Fisch | ja |
| Fischereihafen: Schalentiere | Fischereihafen | 5 | 1.200 $ | Schalentiere | ja |
| Kohlemine | Mine | 5 | 1.200 $ | Kohle | nein |
| Eisenmine | Mine | 5 | 1.200 $ | Eisen | nein |
| Goldmine | Mine | 5 | 1.200 $ | Gold | nein |

Die später relevanten Minenvarianten Nickel, Aluminium und Uran werden nicht als kolonial auswählbare Varianten geführt, solange ihre Warenfreischaltung nicht eindeutig für die Kolonialzeit bestätigt ist.

## Koloniale DLC-Rohstoffgebäude

| Gebäude | DLC | Arbeiter | Bauplan | Baukosten | Ausgabe | Status der Rate |
|---|---|---:|---:|---:|---|---|
| Perlentaucher | Tropican Shores | 4 | 500 $ | 1.000 $ | Perlen | Community-Messwert |
| Imkerei | Return to Nature | 4 | 500 $ | 950 $ | Zucker | Community-Messwert |

## Industrie im Grundspiel

| Gebäude | Arbeiter | Baukosten | Haupteingang | Ausgabe |
|---|---:|---:|---|---|
| Sägewerk | 4 | 5.600 $ | Holzstämme | Bretter |
| Rumdestillerie | 4 | 9.600 $ | Zucker | Rum |
| Gerberei | 5 | 6.000 $ | Häute | Leder |

## Koloniale DLC-Industrie

| Gebäude | DLC | Arbeiter | Bauplan | Baukosten | Funktion |
|---|---|---:|---:|---:|---|
| Spielzeugfabrik | The Llama of Wall Street | 4 | 1.800 $ | 6.500 $ | Holzstämme zu Spielzeug im kolonialen Modus |
| Feuerwerksfabrik | Festival | 4 | 5.100 $ | 10.200 $ | Rohstoffkombinationen zu Feuerwerk |
| Köhlerei | Return to Nature | 4 | 1.250 $ | 5.000 $ | Holzstämme zu Kohle |
| Papiermühle | Return to Nature | 5 | 1.625 $ | 6.500 $ | verschiedene Fasern zu Papier |
| Druckerei | Return to Nature | 5 | 2.125 $ | 8.500 $ | Papier, optional Leder, zu Büchern |

## Landwirtschaftliche Unterstützung

### Miststreuer

- Grundspiel
- Baukosten: 300 $
- Arbeiter: 3 ungelernt
- Lager: 1.000 Mist, mit Verbesserung 3.000
- weiter Sprühbereich: Reichweite 12 Felder
- konzentrierter Sprühbereich: Reichweite 3 Felder
- konzentriert erhöht Bodenregeneration und Mistverbrauch um 200 Prozent
- Effizienz beeinflusst die Verteilungsrate

Der Miststreuer erzeugt keine Ware. Er wird als Unterstützungsgebäude mit Reichweitenbeziehungen modelliert. Eine exakte Umrechnung in zusätzliche Produktionsmenge ist nicht belastbar dokumentiert. Deshalb beeinflusst er zunächst nur eine qualitative Nachhaltigkeitsanzeige und nicht die theoretische Monatsproduktion.

### Multikultur der Plantage

- Grundabzug: 40 Prozent Effizienz
- plus 10 Prozent Effizienz je anderer Feldfrucht in Reichweite, sofern diese Plantage ebenfalls Multikultur verwendet
- dokumentierte Reichweite: ungefähr 13 bis 14 Felder

Da der Auftrag Wege ausschließt, aber nicht Gebäude-Nachbarschaften, kann Multikultur optional als explizite Konfiguration berechnet werden:

`modeEfficiency = -40 % + 10 % × verschiedene passende Nachbarfrüchte`

Der Nutzer muss die Zahl der unterschiedlichen passenden Nachbarfrüchte angeben oder die Anwendung muss sie später über Clusterzuordnung ableiten. Eine Kartenposition wird nicht benötigt.

## Logistikgebäude

| Gebäude | DLC | Arbeiter | Bauplan | Baukosten | Rolle im ersten Modell |
|---|---|---:|---:|---:|---|
| Hafen | Grundspiel | 6 | – | 9.600 $ | Export- und Importendpunkt, Arbeitsplätze |
| Transportbüro | Grundspiel | 6 | – | 2.000 $ | modellierte Transportkapazität |
| Anlegestelle | Grundspiel | 0 | – | 300 $ | Inselverbindung, keine eigene Kapazitätsformel |
| Transporthafen | Grundspiel | 6 | – | 1.700 $ | Inseltransport; getrennte Rolle vom normalen Transportbüro |
| Lagerhaus | Grundspiel | 0 | – | 4.000 $ | Lager- und Verteilpunkt, keine Produktionsleistung |
| Handelsposten | Grundspiel | 0 | 500 $ | 1.500 $ | Handelsmodifikator, keine Produktionsleistung |
| Leuchtturm | Tropican Shores | 1 | 1.500 $ | 6.000 $ | statischer Infrastrukturwert |
| Künstliches Korallenriff | Tropican Shores | 0 | 1.250 $ | 5.000 $ | Unterstützungsbeziehung zu Wassergebäuden |

Das Baubüro bleibt als Arbeitsplatz und Kostenposition erfassbar, erhält aber im ersten Modell keine berechenbare Bauleistung.

## Nahrungsverteilung

### Lebensmittelladen

- Baukosten: 1.200 $
- Arbeiter: 4 ungelernt
- Besucherplätze: 16
- Grund-Servicequalität: 45
- Mindestwohlstand: arm
- verkauft essbare Waren an besuchende Haushalte
- lokale Nahrungsvielfalt und Effizienz skalieren die Servicequalität

Die 16 Besucherplätze sind exakt erfassbar. Daraus darf ohne dokumentierte Besuchsdauer und Besuchshäufigkeit keine exakte Einwohnerzahl pro Monat abgeleitet werden.

## Koloniale Wohngebäude

| Gebäude | DLC | Bauplan | Baukosten | Haushalte | Wohnqualität | Mindestwohlstand |
|---|---|---:|---:|---:|---:|---|
| Hütte | automatisch | – | nicht baubar | 1 | 10 | pleite |
| Landhaus | Grundspiel | – | 850 $ | 2 | 48 | wohlhabend |
| Baracke | Grundspiel | – | 1.200 $ | 6 | 32 | arm |
| Villa | Grundspiel | 500 $ laut Gesamttabelle | 1.200 $ | 2 | 68 | reich |
| Wohnboot | Tropican Shores | 1.000 $ laut Einzelseite | 1.300 $ | 5 | 35 | arm |
| Baumhaus | Return to Nature | 1.000 $ laut Einzelseite | 1.100 $ | 5 | 30 | arm |

Bei Bauplankosten bestehen zwischen Gesamttabelle und einzelnen Wiki-Seiten teilweise Widersprüche. Solche Werte bleiben mit Quellenstatus und Alternativwert dokumentiert.

## Wohnarbeitsmodi, die im Modell berücksichtigt werden können

### Landhaus

- Standard: mindestens wohlhabend
- `Little Eden`: 50 Prozent höhere laufende Kosten, plus 12 Wohnqualität und längere Erholungszeit

### Baracke

- Standard: 6 Haushalte, mindestens arm
- `Stack Them Higher`: plus 2 Haushalte, akzeptiert Pleite-Haushalte, keine Miete

### Villa

- Standard: 2 Haushalte, mindestens reich
- `Upper Upper Class`: mindestens stinkreich und erhöhte Miete

### Wohnboot

- Standard: 5 Haushalte, mindestens arm
- `Collect Flotsam`: akzeptiert Pleite-Haushalte und erhebt keine Miete

### Baumhaus

- Standard: 5 Haushalte, mindestens arm
- Waldmodus: minus 20 Wohnqualität und plus 5 je angrenzendem Baumhaus bei Basiseffizienz

Die spätere Verbesserung des Baumhauses mit zusätzlichen Haushalten wird nicht in der Kolonialzeit angeboten, wenn sie erst in den Weltkriegen verfügbar ist.

## Nicht als eigene Gebäudeauswahl führen

- Straße
- Abrisswerkzeug
- Dekorationen
- Weltwunder ohne direkte Beziehung zu Produktion, Nahrung, Wohnen oder dem theoretischen Logistikmodell

Weltwunder mit klarer Produktions- oder Versorgungswirkung können später als globale Modifikatoren ergänzt werden, nicht als normale Produktionszeile.
