<script lang="ts">
  import { fmt } from '$lib/domain/core';
  import type { ProductionChainStatus } from '$lib/domain/core';

  export let rows: ProductionChainStatus[];
  export let onPlan: (row: ProductionChainStatus) => void;
</script>

<section class="production-status" aria-labelledby="production-status-title">
  <header>
    <div><h2 id="production-status-title">Versorgung deiner Produktionsketten</h2><p>Bedarf und tatsächlich gelieferte Rohstoffe in direktem Vergleich.</p></div>
    <span>Modell-Einheiten je Standardarbeitsschicht</span>
  </header>
  {#if rows.length}
    <div class="chain-grid">
      {#each rows as row}
        <article class:shortage={row.status === 'shortage'}>
          <div class="title"><span>{row.status === 'shortage' ? 'Engpass' : 'Versorgt'}</span><h3>{row.buildingName}: {row.goodName}</h3></div>
          <dl>
            <div><dt>Benötigt</dt><dd>{fmt(row.needed)}</dd></div>
            <div><dt>Geliefert</dt><dd>{fmt(row.delivered)}</dd></div>
            <div class="missing"><dt>Fehlt</dt><dd>{fmt(row.missing)}</dd></div>
          </dl>
          {#if row.action}<button onclick={() => onPlan(row)}>Daraus folgt: {row.action.count} × {row.action.buildingName} einplanen</button>{/if}
        </article>
      {/each}
    </div>
  {:else}<p class="empty">Noch keine Produktionskette mit Rohstoffbedarf erfasst.</p>{/if}
  <p class="model-note">Diese Modellwerte helfen beim Vergleich deiner Gebäude. Sie entsprechen nicht direkt den Lagerbeständen im Spiel.</p>
</section>

<style>
  .production-status { margin-bottom: 18px; padding: 20px; border: 1px solid #d1c3a6; border-radius: 10px; background: #fff9ed; box-shadow: 0 4px 14px rgb(65 53 28 / 7%); }
  header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 15px; }
  h2, h3 { margin: 0; }
  h2 { font-size: 18px; }
  h3 { margin-top: 4px; font-size: 16px; }
  p { margin: 5px 0 0; color: #686157; font-size: 13px; line-height: 1.45; }
  header > span { color: #756b59; font-size: 11px; font-weight: 700; text-align: right; }
  .chain-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  article { padding: 15px; border: 1px solid #b9cfbe; border-left: 4px solid #3f7d55; border-radius: 7px; background: #f1f8f2; }
  article.shortage { border-color: #e0bd7f; border-left-color: #c77a27; background: #fff6e4; }
  .title > span { color: #426252; font-size: 10px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
  .shortage .title > span, .shortage .missing dd { color: #9b4c20; }
  dl { margin: 12px 0 0; }
  dl div { display: flex; justify-content: space-between; gap: 16px; padding: 6px 0; border-bottom: 1px solid rgb(90 86 74 / 15%); }
  dt { color: #655f55; font-size: 13px; }
  dd { margin: 0; font-weight: 750; }
  button { width: 100%; min-height: 38px; margin-top: 12px; padding: 7px 10px; border: 0; border-radius: 5px; background: #c94c32; color: #fff; cursor: pointer; font: inherit; font-size: 13px; font-weight: 750; }
  button:hover, button:focus-visible { background: #a93c28; outline: 2px solid #7f2b20; outline-offset: 2px; }
  .model-note { margin-top: 13px; }
</style>
