<script lang="ts">
  import type { StorageIssue } from '$lib/domain/storage';

  export let issue: StorageIssue;
  export let onReset: () => void;

  let confirmReset = false;

  function downloadRawData() {
    const blob = new Blob([issue.raw], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tropico6-lokale-daten-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }
</script>

<main class="recovery-shell">
  <section class="recovery" role="alert" aria-labelledby="recovery-title">
    <span class="eyebrow">Datensicherheit</span>
    <h1 id="recovery-title">Deine Insel konnte nicht sicher geladen werden</h1>
    <p>{issue.message}</p>
    <p class="preserved">Die gespeicherten Rohdaten wurden nicht verändert und nicht durch die Beispielinsel ersetzt.</p>

    <div class="actions">
      <button class="primary" onclick={downloadRawData}>Rohdaten sichern</button>
      {#if !confirmReset}
        <button class="secondary" onclick={() => (confirmReset = true)}>Mit neuer Beispielinsel beginnen</button>
      {:else}
        <div class="confirmation">
          <strong>Damit werden die beschädigten Daten im aktuellen Speicher ersetzt.</strong>
          <div><button class="danger" onclick={onReset}>Beschädigte Daten ersetzen</button><button class="cancel" onclick={() => (confirmReset = false)}>Abbrechen</button></div>
        </div>
      {/if}
    </div>

    <p class="hint">Wenn du die Datei später prüfen oder wiederherstellen möchtest, sichere zuerst die Rohdaten.</p>
  </section>
</main>

<style>
  :global(*) { box-sizing: border-box; }
  :global(body) { margin: 0; background: #f4e8cf; color: #2b2925; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
  .recovery-shell { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
  .recovery { width: min(680px, 100%); padding: 30px; border: 1px solid #d1c3a6; border-top: 6px solid #b83a32; border-radius: 12px; background: #fff9ed; box-shadow: 0 16px 40px rgb(65 53 28 / 16%); }
  .eyebrow { color: #9c342d; font-size: 12px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
  h1 { margin: 7px 0 0; font-size: clamp(25px, 5vw, 34px); line-height: 1.15; }
  p { margin: 12px 0 0; color: #655f55; line-height: 1.55; }
  .preserved { padding: 12px 14px; border-left: 4px solid #3f7d55; background: #eef7ef; color: #385743; font-weight: 650; }
  .actions { display: flex; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
  button { min-height: 42px; padding: 0 16px; border: 1px solid; border-radius: 6px; cursor: pointer; font: inherit; font-weight: 750; }
  .primary { border-color: #234f45; background: #234f45; color: #fff; }
  .secondary, .cancel { border-color: #8f846e; background: transparent; color: #3d3a34; }
  .danger { border-color: #9c342d; background: #b83a32; color: #fff; }
  button:hover, button:focus-visible { filter: brightness(.92); outline: 2px solid currentColor; outline-offset: 2px; }
  .confirmation { width: 100%; padding: 14px; border: 1px solid #d6a79e; background: #fff0eb; }
  .confirmation strong { display: block; color: #7e302a; font-size: 14px; }
  .confirmation div { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
  .hint { font-size: 13px; }

  @media (max-width: 520px) {
    .recovery-shell { padding: 14px; }
    .recovery { padding: 22px 18px; }
    .actions, .actions > button, .confirmation button { width: 100%; }
  }
</style>
