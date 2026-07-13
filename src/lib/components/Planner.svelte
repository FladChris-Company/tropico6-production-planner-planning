<script lang="ts">
  import { onMount } from 'svelte';
  import Tip from './Tip.svelte';
  import { BUILDINGS, GOODS } from '$lib/domain/data';
  import { calculateScenario, fmt } from '$lib/domain/core';
  import { load, newEntry, save, seed } from '$lib/domain/storage';
  import type { Database, Entry } from '$lib/domain/types';

  let ready = false;
  let db: Database = seed();
  let tab: 'overview' | 'buildings' = 'overview';

  $: project = db.projects.find((item) => item.id === db.activeProjectId) ?? db.projects[0];
  $: scenario = project?.scenarios.find((item) => item.id === project.selectedId) ?? project?.scenarios[0];
  $: allowedBuildings = BUILDINGS.filter((item) => item.dlc === 'base' || project?.dlcs.includes(item.dlc));
  $: result = scenario ? calculateScenario({ scenario, buildings: allowedBuildings, goods: GOODS, settings: db.settings }) : null;

  onMount(() => {
    db = load();
    ready = true;
  });

  function commit() {
    db = { ...db };
    save(db);
  }

  function building(id: string) {
    return BUILDINGS.find((item) => item.id === id)!;
  }

  function addBuilding() {
    const first = allowedBuildings.find((item) => item.kind === 'production') ?? allowedBuildings[0];
    const entry = newEntry(first.id, scenario.clusters[0].id, 'existing');
    entry.modeId = first.modes[0].id;
    scenario.entries.push(entry);
    commit();
  }

  function changeBuilding(entry: Entry) {
    const selected = building(entry.buildingId);
    entry.modeId = selected.modes[0].id;
    entry.rateOverrides = { inputs: {}, outputs: {} };
    commit();
  }

  function removeBuilding(id: string) {
    scenario.entries = scenario.entries.filter((entry) => entry.id !== id);
    commit();
  }
</script>

{#if ready && project && scenario && result}
  <main>
    <header class="app-header">
      <div>
        <span class="product">Tropico 6 Produktionsplaner</span>
        <span class="era">Kolonialzeit</span>
      </div>
      <nav aria-label="Hauptnavigation">
        <button class:active={tab === 'overview'} onclick={() => (tab = 'overview')}>Übersicht</button>
        <button class:active={tab === 'buildings'} onclick={() => (tab = 'buildings')}>Gebäude</button>
      </nav>
    </header>

    <section class="content">
      {#if tab === 'overview'}
        <div class="page-header">
          <div>
            <h1>Übersicht</h1>
            <p>Der aktuelle Stand deiner Insel auf einen Blick.</p>
          </div>
        </div>

        <div class="overview-grid">
          <section class="summary">
            <h2>Überschuss</h2>
            {#if result.topExports.length}
              <table class="summary-table"><tbody>{#each result.topExports as item}<tr><td>{GOODS[item.goodId]?.name}</td><td>{fmt(item.exportable)}</td></tr>{/each}</tbody></table>
            {:else}<p>Kein exportierbarer Überschuss.</p>{/if}
          </section>
          <section class="summary">
            <h2>Transport <Tip text="Näherungsmodell: Zu transportieren sind alle erzeugten und importierten Waren; Fabrikeingänge werden nicht doppelt gezählt. Die Kapazität ergibt sich aus besetzten Transportarbeiterstellen × 500 Einheiten Ladung × Effizienz × Arbeitsmodus × angenommenen zwei Fahrten. Reale Werte können durch Entfernungen, Verkehr, Rückwege, Wohnort, Bedürfnisse und abwesende Arbeiter deutlich abweichen." /></h2>
            <p class="model-unit">Einheiten je Standardarbeitsschicht</p>
            <dl><div><dt>Theoretisch zu transportieren</dt><dd>{fmt(result.transportDemand)}</dd></div><div><dt>Theoretisch transportierbar</dt><dd>{fmt(result.transportCapacity)}</dd></div><div><dt>Differenz</dt><dd class:deficit={result.transportDifference < 0}>{result.transportDifference > 0 ? '+' : ''}{fmt(result.transportDifference)}</dd></div><div><dt>Empfehlung</dt><dd>{result.teamsterOfficeDifference > 0 ? `${fmt(result.teamsterOfficeDifference, 0)} mehr bauen` : result.teamsterOfficeDifference < 0 ? `${fmt(Math.abs(result.teamsterOfficeDifference), 0)} weniger möglich` : 'Anzahl passt'}</dd></div></dl>
          </section>
          <section class="summary">
            <h2>Hinweise</h2>
            <div class="notices">{#each result.diagnostics as item}<article><strong>{item.title}</strong><p>{item.detail}</p></article>{/each}</div>
          </section>
          <section class="summary">
            <h2>Benötigte Arbeiter</h2>
            <table class="summary-table"><thead><tr><th>Bildungsgrad</th><th>Benötigt</th></tr></thead><tbody><tr><td>Ungelernt</td><td>{fmt(result.educationJobs.uneducated, 0)}</td></tr><tr><td>Oberschule</td><td>{fmt(result.educationJobs['high-school'], 0)}</td></tr><tr><td>Hochschule</td><td>{fmt(result.educationJobs.college, 0)}</td></tr></tbody></table>
          </section>
        </div>
      {:else}
        <div class="page-header">
          <div>
            <h1>Gebäude</h1>
            <p>Gebäude, Anzahl und tatsächliche Effizienz deiner Insel.</p>
          </div>
          <button class="add-button" onclick={addBuilding}>Gebäude hinzufügen</button>
        </div>

        <div class="building-list">
          <table>
            <thead><tr><th>Gebäude</th><th>Anzahl</th><th>Effizienz</th><th>Arbeitsmodus</th><th><span class="visually-hidden">Aktionen</span></th></tr></thead>
            <tbody>
              {#each scenario.entries as entry (entry.id)}
                {@const selected = building(entry.buildingId)}
                <tr>
                  <td><select aria-label="Gebäude" bind:value={entry.buildingId} onchange={() => changeBuilding(entry)}>{#each allowedBuildings as option}<option value={option.id}>{option.name}</option>{/each}</select></td>
                  <td><input aria-label={`Anzahl ${selected.name}`} type="number" min="0" step="1" value={entry.count} oninput={(event) => { entry.count = Number(event.currentTarget.value); commit(); }} /></td>
                  <td><label class="percent-input"><span class="visually-hidden">Effizienz {selected.name}</span><input type="number" min="0" max="500" step="1" value={entry.efficiency} oninput={(event) => { entry.efficiency = Number(event.currentTarget.value); commit(); }} /><span>%</span></label></td>
                  <td><select aria-label={`Arbeitsmodus ${selected.name}`} bind:value={entry.modeId} onchange={commit}>{#each selected.modes as mode}<option value={mode.id}>{mode.name}</option>{/each}</select></td>
                  <td class="actions"><button class="delete-button" onclick={() => removeBuilding(entry.id)}>Löschen</button></td>
                </tr>
              {:else}<tr><td class="empty" colspan="5">Noch keine Gebäude eingetragen.</td></tr>{/each}
            </tbody>
          </table>
        </div>
      {/if}
    </section>
  </main>
{/if}

<style>
  :global(*) { box-sizing: border-box; }
  :global(body) { margin: 0; background: #f4f5f6; color: #1f2529; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  :global(button), :global(input), :global(select) { font: inherit; }

  main { min-height: 100vh; }
  .app-header { height: 58px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; border-bottom: 1px solid #cfd5d9; background: #fff; }
  .app-header > div { display: flex; align-items: center; gap: 12px; }
  .product { font-size: 14px; font-weight: 700; }
  .era { padding-left: 12px; border-left: 1px solid #cfd5d9; color: #687178; font-size: 13px; }
  nav { align-self: stretch; display: flex; gap: 6px; }
  nav button { padding: 0 16px; border-bottom: 3px solid transparent; background: transparent; color: #5c676d; font-size: 14px; }
  nav button.active { border-bottom-color: #24353f; color: #1f2529; font-weight: 700; }
  .content { width: min(1180px, calc(100% - 48px)); margin: 0 auto; padding: 42px 0; }
  .page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 22px; }
  h1 { margin: 0; font-size: 30px; line-height: 1.2; }
  p { margin: 7px 0 0; color: #657078; font-size: 14px; }
  button { border: 0; cursor: pointer; }
  .add-button { min-height: 40px; padding: 0 16px; border: 1px solid #24353f; background: #24353f; color: #fff; font-weight: 650; }
  .add-button:hover { background: #17252d; }
  .building-list { overflow-x: auto; border: 1px solid #cbd2d6; background: #fff; }
  .overview-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
  .summary { min-height: 220px; padding: 20px; border: 1px solid #cbd2d6; background: #fff; }
  .summary h2 { margin: 0 0 16px; font-size: 17px; }
  .summary p { line-height: 1.45; }
  .summary .model-unit { margin: -8px 0 8px; font-size: 12px; }
  .summary dl { margin: 0; }
  .summary dl div { display: flex; justify-content: space-between; gap: 20px; padding: 10px 0; border-bottom: 1px solid #e1e5e7; }
  .summary dt { color: #5f6a70; }
  .summary dd { margin: 0; font-weight: 700; }
  .summary dd.deficit { color: #9b2f2f; }
  .summary-table { min-width: 0; }
  .summary-table th, .summary-table td { padding: 9px 0; background: transparent; }
  .summary-table th:last-child, .summary-table td:last-child { text-align: right; }
  .notices article { padding: 10px 0; border-bottom: 1px solid #e1e5e7; }
  .notices article:first-child { padding-top: 0; }
  .notices article:last-child { border-bottom: 0; }
  .notices strong { font-size: 14px; }
  table { width: 100%; min-width: 760px; border-collapse: collapse; }
  th { padding: 11px 14px; border-bottom: 1px solid #cbd2d6; background: #eef1f2; color: #536068; font-size: 12px; font-weight: 700; letter-spacing: .02em; text-align: left; text-transform: uppercase; }
  td { padding: 10px 14px; border-bottom: 1px solid #e1e5e7; }
  tbody tr:last-child td { border-bottom: 0; }
  tbody tr:hover { background: #fafbfb; }
  input, select { width: 100%; height: 36px; padding: 0 10px; border: 1px solid #b9c2c7; border-radius: 0; background: #fff; color: #1f2529; }
  input:focus, select:focus { border-color: #506d7c; outline: 2px solid rgba(80, 109, 124, .16); outline-offset: 0; }
  td:nth-child(1) { width: 42%; }
  td:nth-child(2) { width: 110px; }
  td:nth-child(3) { width: 150px; }
  td:nth-child(4) { width: 230px; }
  .percent-input { display: flex; align-items: center; border: 1px solid #b9c2c7; background: #fff; }
  .percent-input:focus-within { border-color: #506d7c; outline: 2px solid rgba(80, 109, 124, .16); }
  .percent-input input { border: 0; outline: 0; }
  .percent-input span:last-child { padding-right: 10px; color: #677178; }
  .actions { width: 90px; text-align: right; }
  .delete-button { padding: 6px 0; background: transparent; color: #8a3131; font-size: 13px; }
  .delete-button:hover { text-decoration: underline; }
  .empty { padding: 32px; color: #69737a; text-align: center; }
  .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

  @media (max-width: 680px) {
    .app-header { height: auto; align-items: flex-start; flex-direction: column; padding: 14px 18px 0; }
    nav { height: 44px; margin-top: 10px; }
    nav button { padding: 0 14px; }
    .content { width: calc(100% - 28px); padding: 28px 0; }
    .page-header { align-items: stretch; flex-direction: column; }
    .add-button { width: 100%; }
    .overview-grid { grid-template-columns: 1fr; }
  }
</style>
