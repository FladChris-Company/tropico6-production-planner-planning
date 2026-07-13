# Veröffentlichung und rechtlicher Rahmen

## Aktueller Stand

Die Anwendung wird als statische SvelteKit-Webanwendung über GitHub Pages veröffentlicht. GitHub Actions führt vor jeder Veröffentlichung Typprüfung, Komponentenanalyse, Fachtests und den Produktions-Build aus.

Die Anwendung benötigt kein Backend und kein Benutzerkonto. Inselprojekte, Prognosen, Notizen und persönliche Einstellungen bleiben lokal im Browser. Für Sicherung und Gerätewechsel steht ein versionierter JSON-Export zur Verfügung.

## Noch zu klären

- finale Open-Source-Lizenz
- langfristiger Produktname und Branding
- rechtlich nutzbare Gebäude- und Warenillustrationen
- Beitragspolitik für Community-Daten
- Haftungsausschluss für Näherungs- und Community-Werte

## Bereitstellung

- SvelteKit mit statischem Adapter
- GitHub Actions
- GitHub Pages unter dem Repository-Unterpfad
- installierbare PWA und Offline-Cache
- kein Backend für die Kernversion

## Trennung der Daten

Im Repository und damit öffentlich:

- Anwendungscode
- Stammdaten und Quellenstatus
- Berechnungslogik
- Dokumentation
- automatisierte Testfälle

Nur lokal beim Nutzer:

- Inselprojekte
- Ist-Stände und Prognosen
- Cluster und Gebäudeeinträge
- individuelle Messwerte und Notizen
- persönliche Einstellungen

## Markenhinweis

Tropico 6 und die zugehörigen Bezeichnungen sind Eigentum der jeweiligen Rechteinhaber. Der Produktionsplaner ist ein unabhängiges, nicht offizielles Fan-Werkzeug.
