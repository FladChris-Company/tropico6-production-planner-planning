# Arbeitsanweisungen für dieses Repository

## Geltung und Ziel

Diese Datei gilt repositoryweit. Das Produkt ist für Tropico-6-Spieler, nicht für Entwickler. Jede Änderung muss fachlich korrekt, intuitiv und während einer laufenden Partie schnell nutzbar sein.

## Spielerperspektive

- Bewerte jede Produktentscheidung aus Sicht eines Tropico-6-Spielers: Welche konkrete Ingame-Frage beantwortet sie, und wie schnell kommt der Spieler zur Antwort?
- Verwende vertraute deutsche Spielbegriffe. Zeige Ergebnis, Engpass und nächste Handlung vor Formeln und Einstellungen.
- Bedienung muss ohne Handbuch verständlich sein: wenige Schritte, klare Zustände, sinnvolle Standardwerte, sichtbare Rückmeldung und keine überraschenden Änderungen am Ist-Stand.
- Verberge Expertenoptionen zunächst. Technische Begriffe, Datenstatus und Modellannahmen gehören in verständliche Details oder Tooltips.
- Bevorzuge Karten, kurze Aussagen und gezielte Details gegenüber einer Excel-artigen Hauptoberfläche. Tabellen sind erlaubt, wenn sie die konkrete Aufgabe nachweislich schneller und klarer machen.
- Prüfe Maus, Tastatur und Touch sowie schmale Bildschirme. Kritische Aktionen müssen eindeutig und bestätigbar sein.
- Bei Zielkonflikten haben Spielerverständlichkeit, Datenintegrität, fachliche Korrektheit und Barrierefreiheit Vorrang vor technischer Eleganz.

## Token- und Arbeitsdisziplin

- Arbeite knapp und ergebnisorientiert. Keine langen Vorreden, wiederholten Zusammenfassungen oder Erklärungen offensichtlicher Schritte.
- Gib Zwischenstände nur bei wichtigen Befunden, längeren Arbeiten oder Blockern. Fasse mehrere kleine Schritte zusammen.
- Suche zuerst gezielt mit `rg`/`rg --files`. Lies danach nur betroffene und tatsächlich relevante Dateien vollständig; lade nicht vorsorglich den gesamten Dokumentationsbaum.
- Nutze vorhandene Quellen, Typen und Tests statt große Inhalte erneut auszugeben. Zitiere im Abschluss nur entscheidende Stellen.
- Bündele unabhängige Lese- und Prüfkommandos. Erstelle für kleine, eindeutige Aufgaben keinen ausführlichen Plan.
- Abschlussantworten enthalten nur Ergebnis, wichtige Entscheidungen, geänderte Dateien, Prüfstatus und echte Restpunkte.
- Wiederhole keine unveränderten Informationen aus vorherigen Nachrichten.

## Repository

- Produktiv: SvelteKit 2, Svelte 5, TypeScript, Vite, Vitest, statischer GitHub-Pages-Build.
- Einstieg: `src/routes/+page.svelte`; aktuelle UI-Orchestrierung: `src/lib/components/Planner.svelte`.
- Domäne und Daten: `src/lib/domain/`; Browser-Persistenz: `src/lib/domain/storage.ts`.
- `manual/*.csv` ist die gepflegte Wissensquelle. `npm run data:generate` erzeugt daraus die kolonialen Laufzeitdaten; `npm run data:check` prüft die Synchronität. Generierte Dateien nicht manuell ändern.
- `app/index.html` gehört nicht zum SvelteKit-Build. `release/` enthält historische Artefakte. Beide nur ändern, wenn die Aufgabe sie ausdrücklich betrifft.

## Vor Änderungen

- Lies jede zu ändernde Datei vollständig sowie direkt abhängige Typen, Tests und Architekturentscheidungen.
- Für Architektur- oder Fachänderungen: passende `docs/`, ADRs und thematisch relevante Dokumente unter `docs/research/colonial-era-planner/` lesen. Nicht pauschal alle Dokumente laden.
- Git-Status prüfen; nicht direkt auf `main` arbeiten.
- Keine Spieldaten, Quellen, APIs, Felder oder Abhängigkeiten erfinden.

## Architektur und Daten

- Berechnungen möglichst rein und unabhängig von Svelte, DOM und Speicher halten; Routen dünn halten.
- Neue eigenständige UI-Funktionen aus `Planner.svelte` in fokussierte Komponenten und reine Selektoren auslagern, ohne vorsorgliche Abstraktionen.
- Persistenz in `storage.ts` kapseln. Schemaänderungen brauchen verlustfreie Migrationen und Tests; lokale Daten nie still durch Beispieldaten ersetzen.
- Stabile IDs verwenden. Änderungen an Gebäude-, Waren-, DLC- oder Modus-IDs sind Migrationen.
- Spieldaten, Nutzerdaten und manuelle Überschreibungen trennen. Berechnungen und Prognosen ändern den Ist-Stand nie automatisch.
- Formeln definieren Einheit, Zeitbasis, Datenstatus und Annahmen. Die offene Einheitennormalisierung aus der Kolonialzeit-Recherche beachten.
- Werte aus `manual/` nur mit Quelle, Spielversion soweit bekannt, DLC, Einheit und Status übernehmen.
- `null` bedeutet unbekannt; `0` bedeutet bestätigte Null. Unsicherheit sichtbar machen und Scheingenauigkeit vermeiden.
- Rezept- und Stammdatenänderungen auf Referenzen, doppelte IDs, Zyklen und Ära-/DLC-Freischaltung prüfen.
- Neue Abhängigkeiten nur mit klarem Nutzen und dokumentierter Architekturfolge einführen.

## Dokumentation

- Akzeptierte ADRs gelten. Widersprüche durch neues ADR oder Statuswechsel auflösen, nicht still überschreiben.
- README, STATUS, Roadmap, Architektur und Implementierung bei Verhaltensänderungen gemeinsam konsistent halten.
- ADR-0009 ersetzt die frühere reine Planungsphase.
- Widersprüche zwischen älterer Zielarchitektur und neuer Forschungsplanung vor der Umsetzung ausdrücklich entscheiden.

## Risikobasierte Qualitätssicherung

- Nicht nach jedem kleinen Edit testen. Erst zusammenhängende Änderungen abschließen, dann die kleinste aussagekräftige Prüfung ausführen.
- Reine Dokumentationsänderung: Datei vollständig lesen, Links/Pfade plausibilisieren, `git diff --check` und vollständigen Diff prüfen. Keine App-Tests nötig.
- Lokale UI- oder Komponentenänderung: `npm run check` plus relevante Tests; Build nur bei Routing, Styling-Pipeline, statischer Ausgabe oder vor Release.
- Reine Fachlogik: gezielten Vitest-Test während der Arbeit, am Ende `npm test` und `npm run check`.
- Persistenz, Schema, Einheiten, Kernformeln, Abhängigkeiten, Build-Konfiguration oder Release: `npm run check`, `npm test` und `npm run build` einmal gesammelt vor Abschluss.
- Neue oder geänderte Fachlogik benötigt Regressionstests. Tests müssen Spielerfälle und verständliche Ergebnisse abbilden, nicht nur Implementierungsdetails.
- Im Repository existieren derzeit keine eigenen Formatter- oder Linter-Skripte; nicht behaupten, sie ausgeführt zu haben.
- Vor Abschluss vollständigen Git-Diff prüfen und temporäre Dateien, Debug-Ausgaben und Testmarker entfernen.

## Git

- Kein selbstständiger Push, Merge oder Rebase.
- Keine Secrets, Zugangsdaten oder lokalen Konfigurationen committen.
- Historische Release-Artefakte nicht ohne ausdrücklichen Auftrag ändern.
