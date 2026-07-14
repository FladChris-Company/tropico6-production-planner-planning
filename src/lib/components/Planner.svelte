<script lang="ts">
  import { onMount } from 'svelte';
  import BuildingCard from './BuildingCard.svelte';
  import BuildingPicker from './BuildingPicker.svelte';
  import NextActions from './NextActions.svelte';
  import ProjectBackup from './ProjectBackup.svelte';
  import ProductionGoalPlanner from './ProductionGoalPlanner.svelte';
  import ProductionStatus from './ProductionStatus.svelte';
  import StorageRecovery from './StorageRecovery.svelte';
  import Tip from './Tip.svelte';
  import { BUILDINGS, ERAS, GOODS, buildingAvailableInEra, describeDataStatus, missingCalculationLabel, withDataStatusIndicator } from '$lib/domain/data';
  import { calculateEntryPerformance, calculateScenario, describeIslandChange, fmt, nextPlayerActions, productionChainStatus, supplyActionForEntry } from '$lib/domain/core';
  import type { PlayerAction, ProductionChainStatus } from '$lib/domain/core';
  import { load, newEntry, save, seed } from '$lib/domain/storage';
  import { PLANNER_NAVIGATION } from '$lib/domain/navigation';
  import type { PlannerTab } from '$lib/domain/navigation';
  import { removeEntry, restoreEntry } from '$lib/domain/entries';
  import type { RemovedEntry } from '$lib/domain/entries';
  import type { StorageIssue } from '$lib/domain/storage';
  import type { Database, Entry } from '$lib/domain/types';

  let ready = false;
  let db: Database = seed();
  let tab: PlannerTab = 'overview';
  let pickerOpen = false;
  let storageIssue: StorageIssue | null = null;
  let storageNotice = '';
  let changeNotice = '';
  let removedEntry: RemovedEntry | null = null;

  $: project = db.projects.find((item) => item.id === db.activeProjectId) ?? db.projects[0];
  $: scenario = project?.scenarios.find((item) => item.id === project.selectedId) ?? project?.scenarios[0];
  $: currentEra = ERAS.find((item) => item.id === project?.era) ?? ERAS[0];
  $: projectBuildings = BUILDINGS.filter((item) => item.dlc === 'base' || project?.dlcs.includes(item.dlc));
  $: selectableBuildings = projectBuildings.filter((item) => buildingAvailableInEra(item, project?.era ?? 'colonial'));
  $: result = scenario ? calculateScenario({ scenario, buildings: projectBuildings, goods: GOODS, settings: db.settings, era: project?.era }) : null;
  $: exportableGoods = result ? result.balances.filter((item) => item.exportable > .01).sort((a,b) => b.exportable - a.exportable) : [];
  $: playerActions = result ? nextPlayerActions(result) : [];
  $: productionRows = result ? productionChainStatus(result, GOODS) : [];

  onMount(() => {
    const stored = load();
    if (stored.database) db = stored.database;
    storageIssue = stored.issue;
    storageNotice = stored.state === 'migrated' ? 'Ältere Inseldaten wurden sicher übernommen und auf das aktuelle Format aktualisiert.' : '';
    ready = true;
  });

  function resetAfterStorageIssue() {
    db = seed();
    save(db);
    storageIssue = null;
    storageNotice = 'Eine neue Beispielinsel wurde angelegt.';
  }

  function commit(feedbackLabel = '', previous = result, preserveUndo = false) {
    db = { ...db };
    save(db);
    if (!preserveUndo) removedEntry = null;
    if (feedbackLabel && previous) {
      const after = calculateScenario({ scenario, buildings: projectBuildings, goods: GOODS, settings: db.settings, era: project.era });
      changeNotice = describeIslandChange(previous, after, feedbackLabel);
    }
  }

  function applyImportedDatabase(imported: Database) {
    db = imported;
    save(db);
  }

  function building(id: string) {
    return BUILDINGS.find((item) => item.id === id)!;
  }

  function addBuilding(buildingId: string, status: Entry['status'] = 'existing', count = 1, clusterId = scenario.clusters[0].id) {
    const previous = result;
    const selected = building(buildingId);
    const entry = newEntry(selected.id, clusterId, status);
    entry.modeId = selected.modes[0].id;
    entry.count = count;
    scenario.entries.push(entry);
    commit(`${fmt(count, 0)} × ${selected.name} ${status === 'planned' ? 'eingeplant' : 'hinzugefügt'}`, previous);
  }

  function selectBuilding(buildingId: string) {
    addBuilding(buildingId);
    pickerOpen = false;
  }

  function planSupply(entry: Entry, action: NonNullable<ReturnType<typeof supplyActionForEntry>>) {
    addBuilding(action.buildingId, 'planned', action.count, entry.clusterId);
  }

  function runPlayerAction(action: PlayerAction) {
    if (action.kind === 'supply') {
      const entry = scenario.entries.find((item) => item.id === action.entryId);
      addBuilding(action.buildingId, 'planned', action.count, entry?.clusterId ?? scenario.clusters[0].id);
      return;
    }
    if (action.kind === 'teamster') {
      addBuilding(action.buildingId, 'planned', action.count);
      return;
    }
    tab = 'buildings';
  }

  function planProduction(row: ProductionChainStatus) {
    if (!row.action) return;
    const entry = scenario.entries.find((item) => item.id === row.entryId);
    addBuilding(row.action.buildingId, 'planned', row.action.count, entry?.clusterId ?? scenario.clusters[0].id);
  }

  function changeBuilding(entry: Entry) {
    const previous = result;
    const selected = building(entry.buildingId);
    entry.modeId = selected.modes[0].id;
    entry.rateOverrides = { inputs: {}, outputs: {} };
    entry.upgradeIds = [];
    commit(`${selected.name} ausgewählt`, previous);
  }

  function removeBuilding(id: string) {
    const previous = result;
    const removal = removeEntry(scenario.entries, id);
    if (!removal.removed) return;
    removedEntry = removal.removed;
    scenario.entries = removal.entries;
    commit(`${building(removal.removed.entry.buildingId).name} entfernt`, previous, true);
  }

  function undoRemoveBuilding() {
    if (!removedEntry) return;
    const previous = result;
    const name = building(removedEntry.entry.buildingId).name;
    scenario.entries = restoreEntry(scenario.entries, removedEntry);
    removedEntry = null;
    commit(`${name} wiederhergestellt`, previous);
  }

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

{#if ready && storageIssue}
  <StorageRecovery issue={storageIssue} onReset={resetAfterStorageIssue} />
{:else if ready && project && scenario && result}
  <main>
    <header class="app-header">
      <div>
        <span class="product">Tropico 6 Produktionsplaner</span>
        <label class="project-select"><span class="visually-hidden">Insel</span><select aria-label="Insel" bind:value={db.activeProjectId} onchange={() => commit()}>{#each db.projects as item}<option value={item.id}>{item.name}</option>{/each}</select></label>
        <label class="era-select"><span class="visually-hidden">Zeitalter</span><select aria-label="Zeitalter" bind:value={project.era} onchange={() => commit()}>{#each ERAS as era}<option value={era.id}>{era.name}</option>{/each}</select></label>
      </div>
      <nav aria-label="Hauptnavigation">
        {#each PLANNER_NAVIGATION as item}<button class:active={tab === item.id} onclick={() => (tab = item.id)}>{item.label}</button>{/each}
      </nav>
    </header>

    <section class="content">
      {#if storageNotice}<p class="storage-notice" role="status">{storageNotice}</p>{/if}
      {#if changeNotice}<div class="change-notice" role="status"><span>{changeNotice}</span><div>{#if removedEntry}<button class="undo" onclick={undoRemoveBuilding}>Rückgängig</button>{/if}<button class="dismiss" aria-label="Rückmeldung schließen" onclick={() => { changeNotice = ''; removedEntry = null; }}>×</button></div></div>{/if}
      {#if tab === 'overview'}
        <div class="page-header">
          <div>
            <h1>Inselstand</h1>
            <p>Der aktuelle Stand deiner Insel auf einen Blick.</p>
          </div>
        </div>

        <NextActions actions={playerActions} onAction={runPlayerAction} />
        <ProductionStatus rows={productionRows} onPlan={planProduction} />

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
            <p>Leistung und Engpässe zuerst. Selten benötigte Einstellungen liegen in den Expertendetails.</p>
          </div>
          <button class="add-button" disabled={!selectableBuildings.length} onclick={() => (pickerOpen = true)}>Gebäude hinzufügen</button>
        </div>

        <div class="building-grid">
          {#each scenario.entries as entry (entry.id)}
            {@const selected = building(entry.buildingId)}
            {@const rowPerformance = performance(entry)}
            {@const supplyAction = supplyActionForEntry(result, entry.id)}
            <BuildingCard
              {entry}
              building={selected}
              availableBuildings={buildingOptions(entry)}
              {scenario}
              goods={GOODS}
              performance={rowPerformance}
              {supplyAction}
              tooltips={db.settings.tooltips}
              onChanged={() => commit(`${selected.name} aktualisiert`)}
              onBuildingChanged={() => changeBuilding(entry)}
              onPlanSupply={(action) => planSupply(entry, action)}
              onRemove={() => removeBuilding(entry.id)}
            />
          {:else}<section class="empty"><h2>Noch keine Gebäude erfasst</h2><p>Füge dein erstes gebautes Gebäude hinzu, um den Inselstand zu berechnen.</p><button onclick={() => (pickerOpen = true)}>Gebäude hinzufügen</button></section>{/each}
        </div>
      {/if}

      <BuildingPicker buildings={selectableBuildings} goods={GOODS} open={pickerOpen} onSelect={selectBuilding} onClose={() => (pickerOpen = false)} />
    </section>
  </main>
{/if}

<style>
  :global(*) { box-sizing: border-box; }
  :global(body) { margin: 0; background: #f4e8cf; color: #2b2925; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  :global(button), :global(input), :global(select) { font: inherit; }

  main { min-height: 100vh; }
  .app-header { height: 62px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; border-bottom: 3px solid #d9a441; background: #234f45; color: #fff; }
  .app-header > div { display: flex; align-items: center; gap: 12px; }
  .product { font-size: 14px; font-weight: 800; }
  .project-select { padding-left: 12px; border-left: 1px solid rgb(255 255 255 / 28%); }
  .project-select select { width: auto; max-width: 190px; min-width: 110px; height: 32px; padding: 0 28px 0 8px; border-color: #d4c8ae; background: #fff9ed; font-size: 13px; }
  .era-select { padding-left: 12px; border-left: 1px solid rgb(255 255 255 / 28%); }
  .era-select select { width: auto; min-width: 132px; height: 32px; padding: 0 28px 0 8px; border-color: #d4c8ae; background: #fff9ed; font-size: 13px; }
  nav { align-self: stretch; display: flex; gap: 6px; }
  nav button { padding: 0 16px; border-bottom: 3px solid transparent; background: transparent; color: #dce9e4; font-size: 14px; }
  nav button.active { border-bottom-color: #d9a441; color: #fff; font-weight: 800; }
  .content { width: min(1180px, calc(100% - 48px)); margin: 0 auto; padding: 42px 0; }
  .storage-notice { margin: -20px 0 20px; padding: 11px 14px; border-left: 4px solid #3f7d55; border-radius: 4px; background: #eff8f1; color: #315941; font-weight: 650; }
  .change-notice { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin: -20px 0 20px; padding: 11px 14px; border-left: 4px solid #3f7d55; border-radius: 4px; background: #eff8f1; color: #315941; font-weight: 650; }
  .change-notice > div { display: flex; align-items: center; gap: 8px; }
  .change-notice button { min-height: 30px; flex: 0 0 auto; background: transparent; color: #315941; }
  .change-notice .undo { padding: 0 10px; border: 1px solid #50755c; border-radius: 4px; font-weight: 750; }
  .change-notice .dismiss { width: 28px; border-radius: 50%; font-size: 20px; }
  .change-notice button:hover, .change-notice button:focus-visible { background: #dbeedf; outline: 2px solid #315941; }
  .page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 22px; }
  h1 { margin: 0; font-size: 30px; line-height: 1.2; }
  p { margin: 7px 0 0; color: #657078; font-size: 14px; }
  button { border: 0; cursor: pointer; }
  .add-button { min-height: 42px; padding: 0 17px; border: 1px solid #a83b28; border-radius: 6px; background: #c94c32; color: #fff; font-weight: 750; }
  .add-button:hover { background: #a93c28; }
  .add-button:disabled { border-color: #aeb7bc; background: #aeb7bc; cursor: not-allowed; }
  .overview-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
  .summary { min-height: 220px; padding: 20px; border: 1px solid #d1c3a6; border-radius: 10px; background: #fff9ed; box-shadow: 0 4px 14px rgb(65 53 28 / 7%); }
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
  table { width: 100%; border-collapse: collapse; }
  th { padding: 11px 14px; border-bottom: 1px solid #cbd2d6; background: #eef1f2; color: #536068; font-size: 12px; font-weight: 700; letter-spacing: .02em; text-align: left; text-transform: uppercase; }
  td { padding: 10px 14px; border-bottom: 1px solid #e1e5e7; }
  tbody tr:last-child td { border-bottom: 0; }
  select { width: 100%; height: 36px; padding: 0 10px; border: 1px solid #b9c2c7; background: #fff; color: #1f2529; }
  select:focus { border-color: #506d7c; outline: 2px solid rgba(80, 109, 124, .16); outline-offset: 0; }
  .building-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
  .empty { grid-column: 1 / -1; padding: 38px 24px; border: 1px dashed #b9a98a; border-radius: 10px; background: rgb(255 249 237 / 70%); color: #6b665d; text-align: center; }
  .empty h2 { margin: 0; color: #2b2925; font-size: 20px; }
  .empty button { min-height: 40px; margin-top: 18px; padding: 0 15px; border-radius: 5px; background: #234f45; color: #fff; font-weight: 700; }
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
    .building-grid { grid-template-columns: 1fr; }
  }
</style>
