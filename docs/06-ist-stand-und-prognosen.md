# Ist-Stand, Snapshots und Prognosen

## Grundsatz

Der aktuelle Inselstand und geplante Änderungen dürfen niemals unbemerkt vermischt werden.

## Ist-Stand

Der Nutzer arbeitet auf einem aktuellen Zustand. Beim Festschreiben wird daraus ein unveränderlicher Snapshot.

Ein Snapshot enthält:

- Cluster
- Gebäudebestand
- Effizienzen
- Beschäftigung
- Upgrades
- Arbeitsmodi
- Lagerbestände
- Warenregeln
- Entfernungen
- Beobachtungen

## Prognosen

Eine Prognose entsteht als vollständige Kopie eines ausgewählten Snapshots.

Begründung:

- einfache und robuste Implementierung
- Szenarien bleiben unabhängig
- geringe Datenmenge
- leichter Export
- einfachere Migrationen

## Änderungsliste

Obwohl die Prognose vollständig gespeichert wird, berechnet die Anwendung automatisch die Differenz zur Basis.

Beispiele:

- Gebäude hinzugefügt
- Gebäude entfernt
- Anzahl verändert
- Effizienz verändert
- Clusterzuordnung verändert
- Arbeitsmodus verändert
- Upgrade verändert

## Vergleich

Verglichen werden:

- Gebäudeanzahl
- Arbeitsplätze
- Rohstoffproduktion
- Verbrauch
- Warenproduktion
- Auslastung
- Überschüsse
- Fehlmengen
- Transportabschätzung
- Lagerentwicklung
- neue Engpässe
- behobene Engpässe

## Übernahme

Eine Prognose kann:

- vollständig zum neuen Ist-Stand werden
- teilweise übernommen werden
- archiviert werden
- verworfen werden

Vor einer Übernahme wird automatisch ein Snapshot des alten Ist-Stands erstellt.
