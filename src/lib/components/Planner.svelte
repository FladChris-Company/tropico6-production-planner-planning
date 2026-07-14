<script lang="ts">
  import { onMount } from 'svelte';
  import BuildingDetails from './BuildingDetails.svelte';
  import CalculationPopover from './CalculationPopover.svelte';
  import ProjectBackup from './ProjectBackup.svelte';
  import ProductionGoalPlanner from './ProductionGoalPlanner.svelte';
  import Tip from './Tip.svelte';
  import { BUILDINGS, ERAS, GOODS, buildingAvailableInEra, describeDataStatus, missingCalculationLabel, withDataStatusIndicator } from '$lib/domain/data';
  import { calculateEntryPerformance, calculateScenario, fmt } from '$lib/domain/core';
  import { load, newEntry, save, seed } from '$lib/domain/storage';
  import type { Database, Entry } from '$lib/domain/types';

  let ready = false;
  let db: Database = seed();
  let tab: 'overview' | 'planning' | 'buildings' | 'backup' = 'overview';
  let expandedEntryId = '';

  $: project = db.projects.find((item) => item.id === db.activeProjectId) ?? db.projects[0];
  $: scenario = project?.scenarios.find((item) => item.id === project.selectedId) ?? project?.scenarios[0];
  $: currentEra = ERAS.find((item) => item.id === project?.era) ?? ERAS[0];
  $: projectBuildings = BUILDINGS.filter((item) => item.dlc === 'base' || project?.dlcs.includes(item.dlc));
  $: selectableBuildings = projectBuildings.filter((item) => buildingAvailableInEra(item, project?.era ?? 'colonial'));
  $: result = scenario ? calculateScenario({ scenario, buildings: projectBuildings, goods: GOODS, settings: db.settings, era: project?.era }) : null;
  $: exportableGoods = result ? result.balances.filter((item) => item.exportable > .01).sort((a,b) => b.exportable - a.exportable) : [];

  onMount(() => {
    db = load();
    ready = true;
  });

  function commit() {
    db = { ...db };
    save(db);
  }

  function applyImportedDatabase(imported: Database) {
    db = imported;
    save(db);
  }

  function building(id: string) {
    return BUILDINGS.find((item) => item.id === id)!;
  }

  function addBuilding() {
    const first = selectableBuildings.find((item) => item.kind === 'production') ?? selectableBuildings[0];
    if (!first) return;
    const entry = newEntry(first.id, scenario.clusters[0].id, 'existing');
    entry.modeId = first.modes[0].id;
    scenario.entries.push(entry);
    commit();
  }

  function changeBuilding(entry: Entry) {
    const selected = building(entry.buildingId);
    entry.modeId = selected.modes[0].id;
    entry.rateOverrides = { inputs: {}, outputs: {} };
    entry.upgradeIds = [];
    commit();
  }

  function removeBuilding(id: string) {
    scenario.entries = scenario.entries.filter((entry) => entry.id !== id);
    if (expandedEntryId === id) expandedEntryId = '';
    commit();
  }

  const statusLabel = (status: Entry['status']) => ({existing:'Gebaut',planned:'Geplant',disabled:'Deaktiviert'})[status];

  function buildingOptions(entry: Entry) {
    const selected = building(entry.buildingId);
    return selectableBuildings.some((item) => item.id === selected.id) ? selectableBuildings : [selected, ...selectableBuildings];
  }

  function performance(entry: Entry) {
    const selected = building(entry.buildingId);
    if (entry.status === 'disabled') return {
      label: 'Deaktiviert',
      blocks: [{title:'Status',formula:['Dieses Gebäude bleibt in deiner Inselplanung gespeichert, wird aber nicht berechnet.']}],
      notes: ['Setze den Status auf „Gebaut“ oder „Geplant“, um es wieder einzubeziehen.']
    };
    const value = calculateEntryPerformance({entry, building:selected, era:project.era, settings:db.settings});
    if (selected.kind === 'infrastructure') {
      const education = {'uneducated':'Ungelernt','high-school':'Oberschule','college':'Hochschule'}[selected.education];
      const description = selected.id === 'dock'
        ? 'Der Hafen wird als Arbeitsplatz berücksichtigt. Eine eigene Umschlagkapazität ist noch nicht Teil des Modells.'
        : selected.id === 'construction-office'
          ? 'Das Baubüro wird als Arbeitsplatz berücksichtigt. Baugeschwindigkeit und Bauleistung werden noch nicht berechnet.'
          : selected.id === 'palace'
            ? 'Der Palast wird als Arbeitsplatz berücksichtigt und besitzt keine Warenproduktion.'
            : `${selected.name} wird vollständig in der Arbeiterberechnung berücksichtigt und besitzt keine modellierte Warenproduktion.`;
      return {
        label: selected.id === 'dock' || selected.id === 'construction-office' ? 'Nicht berechnet' : 'Keine Warenleistung',
        blocks: [{title:'Funktion im Modell',formula:[description]}],
        notes: [`Arbeitsplätze: ${fmt(entry.count * value.effectiveWorkers,0)} · Bildungsgrad: ${education} · ${fmt(entry.count,0)} ${entry.count === 1 ? 'Gebäude' : 'Gebäude'}.`]
      };
    }
    if (selected.kind === 'teamster') {
      return {
        label: `${fmt(value.transportCapacity)} Transportkapazität`,
        blocks: [{
          title: 'Transportkapazität',
          formula: [
            `${fmt(entry.count,0)} ${entry.count === 1 ? 'Büro' : 'Büros'} × ${value.effectiveWorkers} Arbeiter × ${fmt(entry.staffing,0)} % Besetzung`,
            `× ${fmt(value.loadPerTrip,0)} Einheiten × ${fmt(db.settings.transportTripsPerWorker,0)} theoretische Fahrten × ${fmt(value.effectiveEfficiency,0)} %`,
            ...(value.modeFactor !== 1 ? [`× ${fmt(value.modeFactor,2)} Arbeitsmodusfaktor`] : [])
          ],
          result: `= ${fmt(value.transportCapacity)} Einheiten`
        }],
        notes: [
          `Arbeitsmodus: ${value.mode.name}`,
          `Modellannahme: ${fmt(db.settings.transportTripsPerWorker,0)} Fahrten je Arbeiter und Berechnungsperiode.`,
          'Die Transportkapazität ist ein Näherungswert und kann im Spiel abweichen.'
        ]
      };
    }
    if (!value.calculable) {
      const inputGoods = Object.keys(value.mode.inputs).map((good) => GOODS[good]?.name ?? good);
      const outputGoods = Object.keys(value.mode.outputs).map((good) => GOODS[good]?.name ?? good);
      const relationship = [inputGoods.join(' + '), outputGoods.join(' + ')].filter(Boolean).join(' → ');
      const batch = value.mode.referenceBatch;
      const batchSide = (rates: Record<string, number>) => Object.entries(rates).map(([good, amount]) => `${fmt(amount, 0)} ${GOODS[good]?.name ?? good}`).join(' + ');
      const batchText = batch ? `${batchSide(batch.inputs)} → ${batchSide(batch.outputs)}` : '';
      return {
        label: relationship ? `${relationship} · Rate fehlt` : missingCalculationLabel,
        blocks:[
          {title:'Bekannter Produktionsweg',formula:[relationship || `Für ${selected.name} ist noch kein Produktionsweg dokumentiert.`]},
          ...(batchText ? [{title:'Dokumentierte Testcharge',formula:[batchText,'Diese Mengen zeigen nur das Umwandlungsverhältnis, nicht die Leistung pro Arbeitstag.']}] : [])
        ],
        notes:[describeDataStatus(selected.dataStatus),...(selected.dataNote ? [selected.dataNote] : [])]
      };
    }
    const inputLabel=Object.entries(value.inputs).map(([good,amount])=>`−${fmt(amount)} ${GOODS[good]?.name??good}`).join(', ');
    const outputLabel=Object.entries(value.outputs).map(([good,amount])=>`+${fmt(amount)} ${GOODS[good]?.name??good}`).join(', ');
    const unit = selected.id === 'plantation-sugar' ? (entry.count === 1 ? 'Plantage' : 'Plantagen') : selected.id === 'rum-distillery' ? (entry.count === 1 ? 'Destillerie' : 'Destillerien') : (entry.count === 1 ? 'Gebäude' : 'Gebäude');
    const blocks=(source:Record<string,number|null>,kind:'Verbrauch'|'Produktion')=>Object.entries(source).map(([good,rate])=>({
      title:`${GOODS[good]?.name??good}${kind === 'Verbrauch' ? 'verbrauch' : 'produktion'}`,
      formula:[`${fmt(entry.count,0)} ${unit} × ${fmt(Number(rate)*value.effectiveWorkers)} ${GOODS[good]?.name??good} × ${fmt(value.effectiveEfficiency,0)} %`],
      result:`= ${fmt(Number(rate)*value.effectiveWorkers*entry.count*value.effectiveEfficiency/100)} ${GOODS[good]?.name??good}`
    }));
    const dataNote = describeDataStatus(selected.dataStatus);
    return {
      label:withDataStatusIndicator([inputLabel,outputLabel].filter(Boolean).join(' → '), selected.dataStatus),
      blocks:[...blocks(value.mode.inputs,'Verbrauch'),...blocks(value.mode.outputs,'Produktion')],
      notes:[value.mode.name === 'Standard' || value.mode.name === 'Normalbetrieb' ? `Arbeitsmodus: ${value.mode.name}` : `Berücksichtigt: ${value.mode.name}`,dataNote,...(selected.dataNote ? [selected.dataNote] : [])]
    };
  }
</script>

{#if ready && project && scenario && result}
  <main>
    <header class="app-header">
      <div>
        <span class="product">Tropico 6 Produktionsplaner</span>
        <label class="project-select"><span class="visually-hidden">Insel</span><select aria-label="Insel" bind:value={db.activeProjectId} onchange={commit}>{#each db.projects as item}<option value={item.id}>{item.name}</option>{/each}</select></label>
        <label class="era-select"><span class="visually-hidden">Zeitalter</span><select aria-label="Zeitalter" bind:value={project.era} onchange={commit}>{#each ERAS as era}<option value={era.id}>{era.name}</option>{/each}</select></label>
      </div>
      <nav aria-label="Hauptnavigation">
        <button class:active={tab === 'overview'} onclick={() => (tab = 'overview')}>Übersicht</button>
        <button class:active={tab === 'planning'} onclick={() => (tab = 'planning')}>Planung</button>
        <button class:active={tab === 'buildings'} onclick={() => (tab = 'buildings')}>Gebäude</button>
        <button class:active={tab === 'backup'} onclick={() => (tab = 'backup')}>Sicherung</button>
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
          <section class="summary surplus-summary">
            <h2>Überschuss</h2>
            {#if exportableGoods.length}
              <div class="summary-scroll" role="region" aria-label="Alle Warenüberschüsse"><table class="summary-table"><tbody>{#each exportableGoods as item}<tr><td>{GOODS[item.goodId]?.name}</td><td>{fmt(item.exportable)}</td></tr>{/each}</tbody></table></div>
            {:else}<p>Kein exportierbarer Überschuss.</p>{/if}
          </section>
          <section class="summary">
            <h2>Transport <Tip text={`Näherungsmodell für ${currentEra.name}: Zu transportieren sind alle erzeugten und importierten Waren; Fabrikeingänge werden nicht doppelt gezählt. Die Kapazität ergibt sich aus besetzten Transportarbeiterstellen × ${currentEra.loadPerTrip} Einheiten Ladung × Effizienz × Arbeitsmodus × angenommenen zwei Fahrten. Reale Werte können durch Entfernungen, Verkehr, Rückwege, Wohnort, Bedürfnisse und abwesende Arbeiter deutlich abweichen.`} /></h2>
            <p class="model-unit">Einheiten je Standardarbeitsschicht</p>
            <dl><div><dt>Theoretisch zu transportieren</dt><dd>{fmt(result.transportDemand)}</dd></div><div><dt>Theoretisch transportierbar</dt><dd>{fmt(result.transportCapacity)}</dd></div><div><dt>Differenz</dt><dd class:deficit={result.transportDifference < 0}>{result.transportDifference > 0 ? '+' : ''}{fmt(result.transportDifference)}</dd></div><div><dt>Empfehlung</dt><dd>{result.teamsterOfficeDifference > 0 ? `${fmt(result.teamsterOfficeDifference, 0)} mehr bauen` : result.teamsterOfficeDifference < 0 ? `${fmt(Math.abs(result.teamsterOfficeDifference), 0)} weniger möglich` : 'Anzahl passt'}</dd></div></dl>
          </section>
          <section class="summary">
            <h2>Hinweise</h2>
            <div class="notices">{#each result.diagnostics as item}<article><strong>{item.title}</strong><p>{item.detail}</p>{#if item.items?.length}<ul>{#each item.items as detail}<li>{detail}</li>{/each}</ul>{/if}</article>{/each}</div>
          </section>
          <section class="summary">
            <h2>Benötigte Arbeiter</h2>
            <table class="summary-table"><thead><tr><th>Bildungsgrad</th><th>Benötigt</th></tr></thead><tbody><tr><td>Ungelernt</td><td>{fmt(result.educationJobs.uneducated, 0)}</td></tr><tr><td>Oberschule</td><td>{fmt(result.educationJobs['high-school'], 0)}</td></tr><tr><td>Hochschule</td><td>{fmt(result.educationJobs.college, 0)}</td></tr></tbody></table>
          </section>
        </div>
      {:else if tab === 'planning'}
        <ProductionGoalPlanner buildings={selectableBuildings} entries={scenario.entries} settings={db.settings} goods={GOODS} />
      {:else if tab === 'backup'}
        <ProjectBackup database={db} {project} buildings={BUILDINGS} onImported={applyImportedDatabase} />
      {:else}
        <div class="page-header">
          <div>
            <h1>Gebäude</h1>
            <p>Gebäude, Anzahl und Grundeffizienz deiner Insel. Weitere Angaben liegen übersichtlich unter „Details“.</p>
          </div>
          <button class="add-button" disabled={!selectableBuildings.length} onclick={addBuilding}>Gebäude hinzufügen</button>
        </div>

        <div class="building-list">
          <table>
            <thead><tr><th>Gebäude</th><th>Anzahl</th><th>Grundeffizienz</th><th>Arbeitsmodus</th><th>Leistung</th><th><span class="visually-hidden">Aktionen</span></th></tr></thead>
            <tbody>
              {#each scenario.entries as entry (entry.id)}
                {@const selected = building(entry.buildingId)}
                {@const rowPerformance = performance(entry)}
                <tr class:disabled-row={entry.status === 'disabled'}>
                  <td><span class={`entry-status ${entry.status}`}>{statusLabel(entry.status)}</span><select aria-label="Gebäude" bind:value={entry.buildingId} onchange={() => changeBuilding(entry)}>{#each buildingOptions(entry) as option}<option value={option.id}>{option.name}</option>{/each}</select></td>
                  <td><input aria-label={`Anzahl ${selected.name}`} type="number" min="0" step="1" value={entry.count} oninput={(event) => { entry.count = Number(event.currentTarget.value); commit(); }} /></td>
                  <td><label class="percent-input"><span class="visually-hidden">Effizienz {selected.name}</span><input type="number" min="0" max="500" step="1" value={entry.efficiency} oninput={(event) => { entry.efficiency = Number(event.currentTarget.value); commit(); }} /><span>%</span></label></td>
                  <td><select aria-label={`Arbeitsmodus ${selected.name}`} bind:value={entry.modeId} onchange={commit}>{#each selected.modes as mode}<option value={mode.id}>{mode.name}</option>{/each}</select></td>
                  <td class="performance-cell"><span>{rowPerformance.label}</span><CalculationPopover id={`calculation-${entry.id}`} subject={selected.name} blocks={rowPerformance.blocks} notes={rowPerformance.notes} enabled={db.settings.tooltips} /></td>
                  <td class="actions"><button class="details-button" aria-expanded={expandedEntryId === entry.id} onclick={() => (expandedEntryId = expandedEntryId === entry.id ? '' : entry.id)}>{expandedEntryId === entry.id ? 'Schließen' : 'Details'}</button><button class="delete-button" onclick={() => removeBuilding(entry.id)}>Löschen</button></td>
                </tr>
                {#if expandedEntryId === entry.id}<tr class="details-row"><td colspan="6"><BuildingDetails {entry} building={selected} {scenario} goods={GOODS} onChanged={commit} /></td></tr>{/if}
              {:else}<tr><td class="empty" colspan="6">Noch keine Gebäude eingetragen.</td></tr>{/each}
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
  .project-select { padding-left: 12px; border-left: 1px solid #cfd5d9; }
  .project-select select { width: auto; max-width: 190px; min-width: 110px; height: 32px; padding: 0 28px 0 8px; border-color: #c3cbd0; font-size: 13px; }
  .era-select { padding-left: 12px; border-left: 1px solid #cfd5d9; }
  .era-select select { width: auto; min-width: 132px; height: 32px; padding: 0 28px 0 8px; border-color: #c3cbd0; font-size: 13px; }
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
  .add-button:disabled { border-color: #aeb7bc; background: #aeb7bc; cursor: not-allowed; }
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
  .summary-scroll { max-height: 154px; overflow-y: auto; overscroll-behavior: contain; padding-right: 8px; scrollbar-gutter: stable; }
  .notices article { padding: 10px 0; border-bottom: 1px solid #e1e5e7; }
  .notices article:first-child { padding-top: 0; }
  .notices article:last-child { border-bottom: 0; }
  .notices strong { font-size: 14px; }
  .notices ul { margin: 8px 0 0; padding-left: 18px; color: #4f5b62; font-size: 13px; line-height: 1.45; }
  .notices li + li { margin-top: 4px; }
  table { width: 100%; min-width: 1000px; border-collapse: collapse; }
  th { padding: 11px 14px; border-bottom: 1px solid #cbd2d6; background: #eef1f2; color: #536068; font-size: 12px; font-weight: 700; letter-spacing: .02em; text-align: left; text-transform: uppercase; }
  td { padding: 10px 14px; border-bottom: 1px solid #e1e5e7; }
  tbody tr:last-child td { border-bottom: 0; }
  tbody tr:hover { background: #fafbfb; }
  tbody tr.disabled-row { opacity: .65; background: #f5f6f6; }
  input, select { width: 100%; height: 36px; padding: 0 10px; border: 1px solid #b9c2c7; border-radius: 0; background: #fff; color: #1f2529; }
  input:focus, select:focus { border-color: #506d7c; outline: 2px solid rgba(80, 109, 124, .16); outline-offset: 0; }
  td:nth-child(1) { width: 30%; }
  td:nth-child(2) { width: 100px; }
  td:nth-child(3) { width: 140px; }
  td:nth-child(4) { width: 200px; }
  td:nth-child(5) { width: 300px; }
  .percent-input { display: flex; align-items: center; border: 1px solid #b9c2c7; background: #fff; }
  .percent-input:focus-within { border-color: #506d7c; outline: 2px solid rgba(80, 109, 124, .16); }
  .percent-input input { border: 0; outline: 0; }
  .percent-input span:last-child { padding-right: 10px; color: #677178; }
  .actions { width: 100px; text-align: right; }
  .performance-cell { color: #26343b; font-size: 13px; white-space: nowrap; }
  .delete-button { padding: 6px 0; background: transparent; color: #8a3131; font-size: 13px; }
  .delete-button:hover { text-decoration: underline; }
  .details-button { display: block; margin: 0 0 3px auto; padding: 4px 0; background: transparent; color: #294f62; font-size: 13px; font-weight: 700; }
  .details-button:hover { text-decoration: underline; }
  .entry-status { display: inline-block; margin-bottom: 5px; padding: 2px 6px; background: #e8eef0; color: #42535c; font-size: 11px; font-weight: 750; text-transform: uppercase; }
  .entry-status.planned { background: #fff0d4; color: #7a5420; }
  .entry-status.disabled { background: #ececec; color: #666; }
  .details-row > td { padding: 0; border-bottom: 2px solid #aeb9be; }
  .details-row:hover { background: transparent; }
  .empty { padding: 32px; color: #69737a; text-align: center; }
  .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

  @media (max-width: 680px) {
    .app-header { height: auto; align-items: flex-start; flex-direction: column; padding: 14px 18px 0; }
    .app-header > div { width: 100%; flex-wrap: wrap; }
    .product { width: 100%; }
    .project-select { padding-left: 0; border-left: 0; }
    .project-select select { max-width: 165px; }
    nav { width: 100%; height: 44px; margin-top: 10px; }
    nav button { min-width: 0; flex: 1; padding: 0 5px; font-size: 13px; }
    .content { width: calc(100% - 28px); padding: 28px 0; }
    .page-header { align-items: stretch; flex-direction: column; }
    .add-button { width: 100%; }
    .overview-grid { grid-template-columns: 1fr; }
  }
</style>
