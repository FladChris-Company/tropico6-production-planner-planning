<script lang="ts">
  import BuildingDetails from './BuildingDetails.svelte';
  import CalculationPopover from './CalculationPopover.svelte';
  import type { Building, Entry, Scenario } from '$lib/domain/types';

  export let entry: Entry;
  export let building: Building;
  export let availableBuildings: Building[];
  export let scenario: Scenario;
  export let goods: Record<string, { name: string }>;
  export let performance: { label: string; blocks: { title?: string; formula: string[]; result?: string }[]; notes: string[] };
  export let supplyAction: { buildingId: string; buildingName: string; goodId: string; count: number } | null;
  export let tooltips = true;
  export let onChanged: () => void;
  export let onBuildingChanged: () => void;
  export let onPlanSupply: (action: NonNullable<typeof supplyAction>) => void;
  export let onRemove: () => void;

  let expanded = false;
  let actionsOpen = false;
  const statusLabel = (status: Entry['status']) => ({ existing: 'Gebaut', planned: 'Geplant', disabled: 'Deaktiviert' })[status];
</script>

<article class:disabled={entry.status === 'disabled'} class="building-card">
  <header>
    <div class="identity">
      <span class="icon" aria-hidden="true">{building.icon}</span>
      <div><span class={`status ${entry.status}`}>{statusLabel(entry.status)}</span><h2>{building.name}</h2><p>{building.modes.find((mode) => mode.id === entry.modeId)?.name ?? building.modes[0].name}</p></div>
    </div>
    <div class="card-actions">
      <button class="more" aria-label={`Weitere Aktionen für ${building.name}`} aria-expanded={actionsOpen} onclick={() => (actionsOpen = !actionsOpen)}>•••</button>
      {#if actionsOpen}<div class="actions-menu"><button onclick={() => { actionsOpen = false; onRemove(); }}>Gebäude entfernen</button></div>{/if}
    </div>
  </header>

  <div class="result" class:shortage={Boolean(supplyAction)}>
    <span>Ergebnis</span>
    <strong>{performance.label}<CalculationPopover id={`calculation-${entry.id}`} subject={building.name} blocks={performance.blocks} notes={performance.notes} enabled={tooltips} /></strong>
    {#if supplyAction}<p>Engpass: {goods[supplyAction.goodId]?.name ?? supplyAction.goodId} fehlt für den vollen Betrieb.</p>{/if}
  </div>

  <div class="quick-values">
    <label><span>Anzahl</span><input aria-label={`Anzahl ${building.name}`} type="number" min="0" step="1" value={entry.count} oninput={(event) => { entry.count = Math.max(0, Number(event.currentTarget.value) || 0); onChanged(); }} /></label>
    <label><span>Grundeffizienz</span><div class="percent"><input aria-label={`Effizienz ${building.name} %`} type="number" min="0" max="500" step="1" value={entry.efficiency} oninput={(event) => { entry.efficiency = Math.min(500, Math.max(0, Number(event.currentTarget.value) || 0)); onChanged(); }} /><span>%</span></div></label>
  </div>

  {#if supplyAction}
    <button class="supply-action" onclick={() => onPlanSupply(supplyAction)}>{supplyAction.count} × {supplyAction.buildingName} einplanen</button>
  {/if}

  <button class="details-toggle" aria-expanded={expanded} onclick={() => (expanded = !expanded)}>{expanded ? 'Expertendetails schließen' : 'Expertendetails öffnen'}</button>
  {#if expanded}
    <BuildingDetails {entry} {building} {availableBuildings} {scenario} {goods} {onChanged} {onBuildingChanged} />
  {/if}
</article>

<style>
  .building-card { overflow: hidden; border: 1px solid #d1c3a6; border-radius: 11px; background: #fff9ed; box-shadow: 0 5px 16px rgb(65 53 28 / 9%); }
  .building-card.disabled { opacity: .66; }
  header { position: relative; display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; padding: 16px 16px 12px; }
  .identity { display: flex; min-width: 0; align-items: center; gap: 12px; }
  .icon { display: grid; width: 46px; height: 46px; flex: 0 0 auto; place-items: center; border-radius: 10px; background: #eadcbd; font-size: 27px; }
  h2 { margin: 3px 0 0; color: #2b2925; font-size: 18px; }
  .identity p { margin: 3px 0 0; overflow: hidden; color: #746e63; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
  .status { display: inline-block; color: #426252; font-size: 10px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }
  .status.planned { color: #94651f; }
  .status.disabled { color: #777; }
  button { border: 0; cursor: pointer; font: inherit; }
  .card-actions { position: relative; }
  .more { width: 34px; height: 30px; border-radius: 5px; background: transparent; color: #6b665d; font-weight: 800; letter-spacing: 2px; }
  .more:hover, .more:focus-visible { background: #efe5cf; outline: 2px solid #234f45; }
  .actions-menu { position: absolute; z-index: 4; top: 34px; right: 0; width: 170px; padding: 6px; border: 1px solid #c9b994; border-radius: 6px; background: #fff9ed; box-shadow: 0 8px 22px rgb(65 53 28 / 18%); }
  .actions-menu button { width: 100%; min-height: 36px; padding: 0 9px; border-radius: 4px; background: transparent; color: #8a3d36; text-align: left; }
  .actions-menu button:hover, .actions-menu button:focus-visible { background: #fff0eb; outline: 2px solid #8a3d36; }
  .result { min-height: 104px; margin: 0 16px; padding: 14px; border-left: 4px solid #3f7d55; border-radius: 5px; background: #eef7ef; }
  .result.shortage { border-left-color: #d4942a; background: #fff3d8; }
  .result > span { display: block; color: #59645e; font-size: 11px; font-weight: 750; letter-spacing: .04em; text-transform: uppercase; }
  .result strong { display: block; margin-top: 5px; color: #2b2925; font-size: 15px; line-height: 1.35; }
  .result p { margin: 6px 0 0; color: #705d37; font-size: 12px; line-height: 1.4; }
  .quick-values { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 14px 16px; }
  label > span { display: block; margin-bottom: 5px; color: #6b665d; font-size: 11px; font-weight: 700; text-transform: uppercase; }
  input { width: 100%; height: 38px; padding: 0 9px; border: 1px solid #b9ae96; border-radius: 5px; background: #fff; color: #2b2925; font: inherit; }
  input:focus { border-color: #234f45; outline: 2px solid rgb(35 79 69 / 18%); }
  .percent { display: flex; align-items: center; border: 1px solid #b9ae96; border-radius: 5px; background: #fff; }
  .percent:focus-within { border-color: #234f45; outline: 2px solid rgb(35 79 69 / 18%); }
  .percent input { border: 0; outline: 0; }
  .percent > span { padding-right: 9px; color: #716b60; }
  .supply-action { width: calc(100% - 32px); min-height: 40px; margin: 0 16px 12px; padding: 8px 12px; border-radius: 6px; background: #c94c32; color: #fff; font-weight: 750; }
  .supply-action:hover, .supply-action:focus-visible { background: #a93c28; outline: 2px solid #7f2b20; outline-offset: 2px; }
  .details-toggle { width: 100%; min-height: 38px; padding: 8px 16px; border-top: 1px solid #e0d4bc; background: #f5ecd9; color: #234f45; font-weight: 700; text-align: left; }
  .details-toggle:hover, .details-toggle:focus-visible { background: #eadfc7; outline: 2px solid #234f45; outline-offset: -2px; }

  @media (max-width: 400px) {
    .quick-values { grid-template-columns: 1fr; }
  }
</style>
