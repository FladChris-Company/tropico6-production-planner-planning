# Projektstatus

## Phase

Produktiv nutzbare Svelte-Anwendung für die Kolonialzeit.

## Umgesetzt

- responsive SvelteKit-Oberfläche mit TypeScript
- statische Bereitstellung über GitHub Pages
- Local-First-Speicherung und Offline-Grundlage
- mehrere Inselprojekte, Cluster und Ausbauprognosen
- Kolonialzeit-Gebäude des Grundspiels und auswählbare DLC-Inhalte
- generierte Kolonialdaten aus der validierten CSV-Wissensquelle unter `manual/`
- normierte Produktionsraten in Warenbestands-Einheiten je Arbeiter-Arbeitstag
- sichtbare, quellenbasierte Schätzwerte mit dokumentierten Annahmen
- belegte koloniale Produktionswege und Testchargen auch ohne erfundene Zeitrate
- Produktions-, Verbrauchs-, Reserve- und Exportbilanz
- theoretische und erwartete Produktion mit sichtbaren Annahmen
- kompakte, mobile Gebäudekarten statt einer horizontal scrollenden Haupttabelle
- durchsuchbarer Hinzufügen-Dialog und direkte Aktionen für fehlende Rohstoffgebäude
- aufklappbare Gebäudedetails für Status, Besetzung, Cluster, Entfernung, individuelle Raten, externe Versorgung und Notizen
- belegte koloniale Verbesserungen mit Auswirkungen auf Effizienz und Arbeitsplätze
- Arbeitsplätze und qualitative Transportbewertung
- rückwärts aufgelöste Bauempfehlung für berechenbare Produktionsketten
- eigener Produktionsziel-Workflow mit gebaut/geplant/noch bauen und zusätzlichem Arbeiterbedarf
- versionierter Insel-Export und validierter Import ohne Überschreiben vorhandener Inseln
- Migration des historischen Beta-Schemas und fehlender Schema-2-Standardfelder
- Wiederherstellungsansicht mit Rohdatensicherung statt stiller Rücksetzung beschädigter lokaler Daten
- priorisierte Diagnosen und erklärende Tooltips
- automatisierte Fachtests, Typprüfung und Produktions-Build

## Bewusste Einschränkungen

- ausschließlich Kolonialzeit
- keine exakte Verkehrs-, Anwesenheits- oder Finanzsimulation
- keine zentrale Speicherung und keine Benutzerkonten
- DLC-Raten ohne belastbare Quelle werden nicht erfunden; Nutzer können sie selbst kalibrieren
- Bevölkerung und allgemeine Bedürfnisversorgung bleiben ein späteres Modul

## Nächste fachliche Arbeiten

- unbekannte Produktionsraten durch reproduzierbare Spielmessungen verifizieren
- weitere Upgrades und Arbeitsmodi ergänzen, sobald belastbare Quellen vorliegen
- Transportmodell mit Spielbeobachtungen kalibrieren
- rechtlich nutzbare Gebäude- und Warenillustrationen ergänzen
