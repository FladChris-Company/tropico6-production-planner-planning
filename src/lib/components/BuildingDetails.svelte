<script lang="ts">
  import { fmt } from '$lib/domain/core';
  import type { Building, Entry, Scenario } from '$lib/domain/types';

  export let entry: Entry;
  export let building: Building;
  export let availableBuildings: Building[];
  export let scenario: Scenario;
  export let goods: Record<string, { name: string }>;
  export let onChanged: () => void;
  export let onBuildingChanged: () => void;

  $: mode = building.modes.find((item) => item.id === entry.modeId) ?? building.modes[0];
  $: inputGoods = Object.entries(mode?.inputs ?? {});
  $: outputGoods = Object.entries(mode?.outputs ?? {});

  function numberValue(event: Event, min = 0, max = Number.POSITIVE_INFINITY) {
    const raw = (event.currentTarget as HTMLInputElement).value;
    if (raw === '') return '';
    return Math.min(max, Math.max(min, Number(raw) || 0));
  }

  function setUpgrade(id: string, checked: boolean) {
    const selected = new Set(entry.upgradeIds ?? []);
    if (checked) selected.add(id);
    else selected.delete(id);
    entry.upgradeIds = [...selected];
    onChanged();
  }

  function setOverride(kind: 'inputs' | 'outputs', goodId: string, event: Event) {
    entry.rateOverrides[kind][goodId] = numberValue(event) as number | '';
    onChanged();
  }

  function setExternalSupply(goodId: string, event: Event) {
    const policy = scenario.policies[goodId] ?? { externalSupply: 0, reserve: 0, exportEnabled: true };
    policy.externalSupply = Number(numberValue(event));
    scenario.policies[goodId] = policy;
    onChanged();
  }

  const defaultRate = (rate: number | null) => rate == null ? 'Keine belastbare Rate' : `Spielwert: ${fmt(rate)}`;
</script>

<section class="details" aria-label={`Details für ${building.name}`}>
  <div class="detail-grid">
    <label>
      <span>Gebäude</span>
      <select aria-label={`Gebäudetyp ${building.name}`} bind:value={entry.buildingId} onchange={onBuildingChanged}>
        {#each availableBuildings as option}<option value={option.id}>{option.name}</option>{/each}
      </select>
    </label>
    <label>
      <span>Arbeitsmodus</span>
      <select aria-label={`Arbeitsmodus ${building.name}`} bind:value={entry.modeId} onchange={onChanged}>
        {#each building.modes as option}<option value={option.id}>{option.name}</option>{/each}
      </select>
    </label>
    <label>
      <span>Status</span>
      <select aria-label={`Status ${building.name}`} bind:value={entry.status} onchange={onChanged}>
        <option value="existing">Gebaut</option>
        <option value="planned">Geplant</option>
        <option value="disabled">Deaktiviert</option>
      </select>
    </label>
    <label>
      <span>Personalbesetzung</span>
      <div class="number-with-unit"><input aria-label={`Personalbesetzung ${building.name}`} type="number" min="0" max="100" step="1" value={entry.staffing} oninput={(event) => { entry.staffing = Number(numberValue(event, 0, 100)); onChanged(); }} /><span>%</span></div>
    </label>
    <label>
      <span>Cluster</span>
      <select aria-label={`Cluster ${building.name}`} bind:value={entry.clusterId} onchange={onChanged}>
        {#each scenario.clusters as cluster}<option value={cluster.id}>{cluster.name}</option>{/each}
      </select>
    </label>
    <label>
      <span>Eigene Entfernung</span>
      <input aria-label={`Entfernung ${building.name}`} type="number" min="0" max="10" step="1" placeholder="Wert des Clusters" value={entry.distance} oninput={(event) => { entry.distance = numberValue(event, 0, 10); onChanged(); }} />
    </label>
  </div>

  <div class="detail-section">
    <h3>Verbesserungen</h3>
    <p>Effizienzboni werden auf die Grundeffizienz in der Hauptzeile aufgeschlagen.</p>
    {#if building.upgrades?.length}
      <div class="upgrade-list">
        {#each building.upgrades as upgrade}
          <label class="upgrade-option">
            <input type="checkbox" checked={(entry.upgradeIds ?? []).includes(upgrade.id)} onchange={(event) => setUpgrade(upgrade.id, event.currentTarget.checked)} />
            <span><strong>{upgrade.name}</strong><small>{upgrade.description}</small></span>
          </label>
        {/each}
      </div>
    {:else}
      <p>Für dieses Gebäude sind in der Wissensquelle keine kolonialen Verbesserungen dokumentiert.</p>
    {/if}
  </div>

  {#if inputGoods.length || outputGoods.length}
    <div class="detail-section">
      <h3>Eigene Produktionsraten</h3>
      <p>Nur eintragen, wenn du im Spiel selbst gemessen hast. Leer verwendet den dokumentierten Spielwert.</p>
      <div class="rate-grid">
        {#each inputGoods as [goodId, rate]}
          <label><span>Verbrauch · {goods[goodId]?.name ?? goodId}</span><input aria-label={`Eigener Verbrauch ${goods[goodId]?.name ?? goodId}`} type="number" min="0" step="any" placeholder={defaultRate(rate)} value={entry.rateOverrides.inputs[goodId] ?? ''} oninput={(event) => setOverride('inputs', goodId, event)} /></label>
        {/each}
        {#each outputGoods as [goodId, rate]}
          <label><span>Produktion · {goods[goodId]?.name ?? goodId}</span><input aria-label={`Eigene Produktion ${goods[goodId]?.name ?? goodId}`} type="number" min="0" step="any" placeholder={defaultRate(rate)} value={entry.rateOverrides.outputs[goodId] ?? ''} oninput={(event) => setOverride('outputs', goodId, event)} /></label>
        {/each}
      </div>
    </div>
  {/if}

  {#if inputGoods.length}
    <div class="detail-section">
      <h3>Externe Versorgung</h3>
      <p>Ware, die du beispielsweise über Handel oder Beute zusätzlich auf die Insel bringst.</p>
      <div class="rate-grid">
        {#each inputGoods as [goodId]}
          <label><span>{goods[goodId]?.name ?? goodId}</span><input aria-label={`Externe Versorgung ${goods[goodId]?.name ?? goodId}`} type="number" min="0" step="any" value={scenario.policies[goodId]?.externalSupply ?? 0} oninput={(event) => setExternalSupply(goodId, event)} /></label>
        {/each}
      </div>
    </div>
  {/if}

  <div class="detail-section">
    <label><span>Notiz</span><textarea aria-label={`Notiz ${building.name}`} rows="3" placeholder="Zum Beispiel: Ausgangslager oft voll" bind:value={entry.note} oninput={onChanged}></textarea></label>
  </div>
</section>

<style>
  .details { padding: 18px; background: #f7f9f9; }
  .detail-grid, .rate-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
  .rate-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  label > span, h3 { display: block; margin: 0 0 7px; color: #536068; font-size: 12px; font-weight: 700; text-transform: uppercase; }
  input, select, textarea { width: 100%; min-height: 38px; padding: 8px 10px; border: 1px solid #b9c2c7; background: #fff; color: #1f2529; font: inherit; }
  textarea { resize: vertical; }
  input:focus, select:focus, textarea:focus { border-color: #506d7c; outline: 2px solid rgba(80, 109, 124, .16); }
  .number-with-unit { display: flex; align-items: center; border: 1px solid #b9c2c7; background: #fff; }
  .number-with-unit:focus-within { border-color: #506d7c; outline: 2px solid rgba(80, 109, 124, .16); }
  .number-with-unit input { border: 0; outline: 0; }
  .number-with-unit span { padding-right: 10px; color: #677178; }
  .detail-section { margin-top: 20px; padding-top: 18px; border-top: 1px solid #dbe0e2; }
  .detail-section > p { margin: -2px 0 12px; color: #657078; font-size: 13px; line-height: 1.45; }
  .upgrade-list { display: grid; gap: 8px; }
  .upgrade-option { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border: 1px solid #d2d8db; background: #fff; }
  .upgrade-option input { width: 18px; min-height: 18px; margin: 2px 0 0; }
  .upgrade-option > span { margin: 0; color: #1f2529; text-transform: none; }
  .upgrade-option strong, .upgrade-option small { display: block; }
  .upgrade-option small { margin-top: 3px; color: #657078; font-size: 12px; font-weight: 400; }

  @media (max-width: 860px) {
    .detail-grid, .rate-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 560px) {
    .detail-grid, .rate-grid { grid-template-columns: 1fr; }
  }
</style>
