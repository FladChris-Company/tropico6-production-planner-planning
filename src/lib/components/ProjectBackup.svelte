<script lang="ts">
  import { importProjectBackup, serializeProjectBackup } from '$lib/domain/storage';
  import type { Building, Database, Project } from '$lib/domain/types';

  export let database: Database;
  export let project: Project;
  export let buildings: Building[];
  export let onImported: (database: Database) => void;

  let message = '';
  let error = '';
  let importing = false;

  const safeFilename = (name: string) => name
    .trim()
    .toLocaleLowerCase('de-DE')
    .replace(/[^a-z0-9äöüß]+/g, '-')
    .replace(/^-|-$/g, '') || 'meine-insel';

  function exportProject() {
    const blob = new Blob([serializeProjectBackup(project)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeFilename(project.name)}.tropico6-plan.json`;
    link.click();
    URL.revokeObjectURL(url);
    error = '';
    message = `„${project.name}“ wurde als Datei gesichert.`;
  }

  async function importProject(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    importing = true;
    message = '';
    error = '';
    try {
      const knownBuildings = new Map(buildings.map((building) => [building.id, building.dlc]));
      const imported = importProjectBackup(await file.text(), database, knownBuildings);
      onImported(imported);
      message = `„${imported.projects.at(-1)?.name ?? 'Insel'}“ wurde als eigene Insel importiert.`;
    } catch (reason) {
      error = reason instanceof Error ? reason.message : 'Die Sicherung konnte nicht importiert werden.';
    } finally {
      importing = false;
      input.value = '';
    }
  }
</script>

<div class="page-header">
  <div>
    <h1>Insel sichern</h1>
    <p>Speichere deinen Inselstand als Datei oder hole eine frühere Sicherung zurück.</p>
  </div>
</div>

<div class="backup-grid">
  <section>
    <span class="eyebrow">Sicherung erstellen</span>
    <h2>{project.name}</h2>
    <p>Enthält Gebäude, Produktionsmodi, Planungen, Cluster und deine eigenen Raten.</p>
    <button class="primary" onclick={exportProject}>Insel als Datei sichern</button>
  </section>

  <section>
    <span class="eyebrow">Sicherung einlesen</span>
    <h2>Insel importieren</h2>
    <p>Die importierte Insel wird zusätzlich angelegt. Dein aktueller Inselstand bleibt erhalten.</p>
    <label class:disabled={importing} class="file-button">
      <span>{importing ? 'Sicherung wird geprüft …' : 'Sicherungsdatei auswählen'}</span>
      <input type="file" accept="application/json,.json" disabled={importing} onchange={importProject} />
    </label>
  </section>
</div>

{#if message}<p class="feedback success" role="status">{message}</p>{/if}
{#if error}<p class="feedback error" role="alert">{error} Dein vorhandener Inselstand wurde nicht verändert.</p>{/if}

<p class="privacy-note">Die Datei wird nur auf deinem Gerät verarbeitet. Es werden keine Inseldaten hochgeladen.</p>

<style>
  .page-header { margin-bottom: 22px; }
  h1 { margin: 0; font-size: 30px; line-height: 1.2; }
  .page-header p, section p, .privacy-note { margin: 7px 0 0; color: #657078; font-size: 14px; line-height: 1.5; }
  .backup-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
  section { padding: 24px; border: 1px solid #cbd2d6; background: #fff; }
  .eyebrow { color: #5f6a70; font-size: 12px; font-weight: 750; letter-spacing: .04em; text-transform: uppercase; }
  h2 { margin: 6px 0 0; font-size: 20px; }
  button, .file-button { display: inline-flex; min-height: 42px; align-items: center; justify-content: center; margin-top: 22px; padding: 0 16px; border: 1px solid #24353f; cursor: pointer; font: inherit; font-weight: 700; }
  .primary { background: #24353f; color: #fff; }
  .primary:hover { background: #17252d; }
  .file-button { background: #fff; color: #24353f; }
  .file-button:hover { background: #f2f5f6; }
  .file-button.disabled { border-color: #aeb7bc; color: #7a858b; cursor: wait; }
  .file-button input { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; }
  .feedback { margin: 18px 0 0; padding: 14px 16px; border-left: 4px solid; font-size: 14px; }
  .feedback.success { border-color: #3f7d55; background: #eff8f1; color: #285b39; }
  .feedback.error { border-color: #a14242; background: #fff1f1; color: #7f2929; }
  .privacy-note { margin-top: 14px; }

  @media (max-width: 680px) {
    .backup-grid { grid-template-columns: 1fr; }
    button, .file-button { width: 100%; }
  }
</style>
