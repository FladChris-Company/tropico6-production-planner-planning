<script lang="ts">
  import { buildGoalPlan, fmt } from '$lib/domain/core';
  import type { Building, Entry, Settings } from '$lib/domain/types';

  export let buildings: Building[];
  export let entries: Entry[];
  export let settings: Settings;
  export let goods: Record<string, { name: string }>;

  let targetId = 'rum-distillery';
  let modeId = 'dunder';
  let count = 1;

  const calculable = (mode: Building['modes'][number]) => Object.keys(mode.outputs).length > 0
    && [...Object.values(mode.inputs), ...Object.values(mode.outputs)].every((rate) => rate != null && Number.isFinite(Number(rate)));

  $: targets = buildings.filter((building) => building.kind === 'production' && building.stage > 0 && building.modes.some(calculable));
  $: if (!targets.some((building) => building.id === targetId)) targetId = targets[0]?.id ?? '';
  $: target = targets.find((building) => building.id === targetId);
  $: modes = target?.modes.filter(calculable) ?? [];
  $: if (!modes.some((mode) => mode.id === modeId)) modeId = modes[0]?.id ?? '';
  $: plan = target && modeId
    ? buildGoalPlan({ buildingId: target.id, count, modeId, buildings, settings, entries, goods })
    : null;
  $: missingRows = plan?.rows.filter((row) => row.missing > 0) ?? [];
  $: recommendation = missingRows.length
    ? `Noch bauen: ${missingRows.map((row) => `${fmt(row.missing, 0)} × ${row.name}`).join(' und ')}.`
    : 'Dein erfasster Inselstand deckt dieses Ziel bereits ab.';
</script>

<div class="page-header">
  <div>
    <h1>Produktionsziel</h1>
    <p>Wähle dein Ziel. Der Planer rechnet die benötigte Kette bis zu den Rohstoffen zurück.</p>
  </div>
</div>

{#if targets.length && target && plan}
  <section class="goal-controls" aria-label="Produktionsziel festlegen">
    <label>
      <span>Zielgebäude</span>
      <select aria-label="Zielgebäude" bind:value={targetId}>
        {#each targets as building}<option value={building.id}>{building.name}</option>{/each}
      </select>
    </label>
    <label>
      <span>Arbeitsmodus</span>
      <select aria-label="Ziel-Arbeitsmodus" bind:value={modeId}>
        {#each modes as mode}<option value={mode.id}>{mode.name}</option>{/each}
      </select>
    </label>
    <label>
      <span>Gewünschte Anzahl</span>
      <input aria-label="Gewünschte Anzahl" type="number" min="1" step="1" value={count} oninput={(event) => (count = Math.max(1, Number(event.currentTarget.value) || 1))} />
    </label>
  </section>

  <section class:complete={!missingRows.length} class="recommendation" aria-live="polite">
    <span class="eyebrow">Dein nächster Ausbau</span>
    <h2>{recommendation}</h2>
    <p>{plan.additionalWorkers > 0 ? `Dafür werden ${fmt(plan.additionalWorkers, 0)} zusätzliche Arbeitsplätze benötigt.` : 'Es werden keine zusätzlichen Arbeitsplätze benötigt.'}</p>
  </section>

  <section class="chain" aria-label={`Produktionskette für ${target.name}`}>
    {#each plan.rows as row, index}
      <article class:missing={row.missing > 0}>
        <div class="card-title"><span aria-hidden="true">{row.icon}</span><h2>{row.name}</h2></div>
        <dl>
          <div><dt>Empfohlen</dt><dd>{fmt(row.recommended, 0)}</dd></div>
          <div><dt>Gebaut</dt><dd>{fmt(row.existing, 0)}</dd></div>
          <div><dt>Geplant</dt><dd>{fmt(row.planned, 0)}</dd></div>
          <div class="difference"><dt>Noch bauen</dt><dd>{fmt(row.missing, 0)}</dd></div>
        </dl>
        <p>Rechnerischer Bedarf: {fmt(row.exact, 2)}</p>
      </article>
      {#if index < plan.rows.length - 1}<span class="arrow" aria-hidden="true">→</span>{/if}
    {/each}
  </section>

  <p class="model-note">Berechnet mit dem gewählten Produktionsprofil. Empfehlungen werden auf ganze Gebäude aufgerundet und ändern deinen Inselstand nicht.</p>
{:else}
  <section class="empty-state"><h2>Noch kein berechenbares Produktionsziel</h2><p>Für die gewählte Ära und DLC-Auswahl fehlt derzeit eine belastbare Produktionskette.</p></section>
{/if}

<style>
  .page-header { margin-bottom: 22px; }
  h1 { margin: 0; font-size: 30px; line-height: 1.2; }
  .page-header p, .recommendation p, article p, .model-note, .empty-state p { margin: 7px 0 0; color: #657078; font-size: 14px; line-height: 1.45; }
  .goal-controls { display: grid; grid-template-columns: 2fr 2fr 1fr; gap: 14px; padding: 18px; border: 1px solid #cbd2d6; background: #fff; }
  label span { display: block; margin-bottom: 7px; color: #536068; font-size: 12px; font-weight: 700; text-transform: uppercase; }
  input, select { width: 100%; height: 40px; padding: 0 10px; border: 1px solid #b9c2c7; background: #fff; color: #1f2529; font: inherit; }
  input:focus, select:focus { border-color: #506d7c; outline: 2px solid rgba(80, 109, 124, .16); }
  .recommendation { margin-top: 18px; padding: 22px; border-left: 5px solid #b56a24; background: #fff8e9; }
  .recommendation.complete { border-left-color: #3f7d55; background: #eff8f1; }
  .eyebrow { color: #7a5b2d; font-size: 12px; font-weight: 750; letter-spacing: .04em; text-transform: uppercase; }
  .recommendation h2 { margin: 5px 0 0; font-size: 21px; }
  .chain { display: flex; align-items: stretch; gap: 10px; margin-top: 18px; overflow-x: auto; padding-bottom: 6px; }
  article { min-width: 210px; flex: 1; padding: 18px; border: 1px solid #cbd2d6; background: #fff; }
  article.missing { border-top: 4px solid #b56a24; padding-top: 15px; }
  .card-title { display: flex; align-items: center; gap: 9px; }
  .card-title > span { font-size: 24px; }
  article h2 { margin: 0; font-size: 17px; }
  dl { margin: 16px 0 0; }
  dl div { display: flex; justify-content: space-between; gap: 16px; padding: 7px 0; border-bottom: 1px solid #e1e5e7; }
  dt { color: #5f6a70; font-size: 13px; }
  dd { margin: 0; font-weight: 700; }
  .difference dd { color: #9b4c20; }
  .arrow { align-self: center; color: #7b858a; font-size: 24px; }
  .model-note { margin-top: 12px; }
  .empty-state { padding: 24px; border: 1px solid #cbd2d6; background: #fff; }
  .empty-state h2 { margin: 0; font-size: 18px; }

  @media (max-width: 760px) {
    .goal-controls { grid-template-columns: 1fr; }
    .chain { align-items: stretch; flex-direction: column; overflow: visible; }
    article { min-width: 0; }
    .arrow { transform: rotate(90deg); }
  }
</style>
