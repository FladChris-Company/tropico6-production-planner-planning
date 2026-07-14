<script lang="ts">
  import { tick } from 'svelte';
  import type { Building } from '$lib/domain/types';

  export let buildings: Building[];
  export let goods: Record<string, { name: string }>;
  export let open = false;
  export let onSelect: (buildingId: string) => void;
  export let onClose: () => void;

  let query = '';
  let wasOpen = false;
  let searchInput: HTMLInputElement;

  $: if (open && !wasOpen) {
    query = '';
    tick().then(() => searchInput?.focus());
  }
  $: wasOpen = open;
  $: normalizedQuery = query.trim().toLocaleLowerCase('de-DE');
  $: filtered = buildings.filter((building) => {
    const relatedGoods = building.modes.flatMap((mode) => [...Object.keys(mode.inputs), ...Object.keys(mode.outputs)]);
    const searchText = [building.name, building.category, building.dlc, ...relatedGoods.map((id) => goods[id]?.name ?? id)].join(' ').toLocaleLowerCase('de-DE');
    return !normalizedQuery || searchText.includes(normalizedQuery);
  });

  function closeOnEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') onClose();
  }
</script>

{#if open}
  <div class="backdrop" role="presentation" onkeydown={closeOnEscape}>
    <dialog open class="picker" aria-modal="true" aria-labelledby="building-picker-title">
      <header>
        <div>
          <span class="eyebrow">Inselbestand</span>
          <h2 id="building-picker-title">Gebautes Gebäude hinzufügen</h2>
          <p>Wähle das Gebäude, das bereits auf deiner Insel steht.</p>
        </div>
        <button class="close" aria-label="Gebäudeauswahl schließen" onclick={onClose}>×</button>
      </header>

      <label class="search">
        <span>Gebäude oder Ware suchen</span>
        <input bind:this={searchInput} type="search" placeholder="Zum Beispiel Zucker, Rum oder Logistik" bind:value={query} />
      </label>

      <ul class="results" aria-label="Verfügbare Gebäude">
        {#each filtered as building}
          <li><button class="building-option" onclick={() => onSelect(building.id)}>
              <span class="icon" aria-hidden="true">{building.icon}</span>
              <span class="option-copy"><strong>{building.name}</strong><small>{building.category}{building.dlc !== 'base' ? ` · DLC: ${building.dlc}` : ''}</small></span>
              <span class:unknown={building.dataStatus === 'unknown'} class="data-state">{building.dataStatus === 'unknown' ? 'Rate fehlt' : 'Auswählen'}</span>
          </button></li>
        {:else}
          <li class="empty">Kein verfügbares Gebäude passt zu „{query}“.</li>
        {/each}
      </ul>
    </dialog>
  </div>
{/if}

<style>
  .backdrop { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 20px; background: rgb(24 35 31 / 58%); }
  .picker { position: static; width: min(680px, 100%); max-height: min(760px, calc(100vh - 40px)); margin: 0; padding: 0; overflow: hidden; border: 1px solid #a99b7c; border-radius: 12px; background: #fff9ed; box-shadow: 0 24px 60px rgb(0 0 0 / 28%); }
  header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding: 22px 22px 16px; border-bottom: 1px solid #e1d4b8; }
  .eyebrow, .search > span { color: #6e654f; font-size: 12px; font-weight: 750; letter-spacing: .04em; text-transform: uppercase; }
  h2 { margin: 4px 0 0; color: #2b2925; font-size: 23px; }
  p { margin: 6px 0 0; color: #6b665d; font-size: 14px; }
  .close { width: 36px; height: 36px; padding: 0; border: 0; border-radius: 50%; background: #efe5cf; color: #3a3934; cursor: pointer; font-size: 24px; line-height: 1; }
  .close:hover, .close:focus-visible { background: #e4d6b8; outline: 2px solid #234f45; }
  .search { display: block; padding: 16px 22px; }
  .search > span { display: block; margin-bottom: 7px; }
  .search input { width: 100%; height: 44px; padding: 0 12px; border: 1px solid #b9ae96; border-radius: 6px; background: #fff; color: #2b2925; font: inherit; }
  .search input:focus { border-color: #234f45; outline: 2px solid rgb(35 79 69 / 18%); }
  .results { max-height: min(480px, calc(100vh - 235px)); margin: 0; overflow-y: auto; padding: 0 22px 22px; list-style: none; }
  .building-option { display: grid; width: 100%; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; border: 0; border-top: 1px solid #e2d8c4; background: transparent; color: #2b2925; text-align: left; cursor: pointer; }
  .building-option:hover, .building-option:focus-visible { background: #f3ead7; outline: 2px solid #234f45; outline-offset: -2px; }
  .icon { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 8px; background: #e7dbc1; font-size: 23px; }
  .option-copy strong, .option-copy small { display: block; }
  .option-copy small { margin-top: 3px; color: #716b60; }
  .data-state { color: #496e59; font-size: 12px; font-weight: 700; }
  .data-state.unknown { color: #906022; }
  .empty { padding: 24px 0; text-align: center; }

  @media (max-width: 560px) {
    .backdrop { align-items: end; padding: 0; }
    .picker { max-height: 94vh; border-radius: 14px 14px 0 0; }
    header, .search { padding-right: 16px; padding-left: 16px; }
    .results { padding-right: 16px; padding-left: 16px; }
    .building-option { grid-template-columns: auto 1fr; }
    .data-state { grid-column: 2; }
  }
</style>
