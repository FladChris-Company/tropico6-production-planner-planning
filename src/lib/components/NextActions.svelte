<script lang="ts">
  import type { PlayerAction } from '$lib/domain/core';

  export let actions: PlayerAction[];
  export let onAction: (action: PlayerAction) => void;

  const actionLabel = (action: PlayerAction) => action.kind === 'supply' || action.kind === 'teamster'
    ? 'Jetzt einplanen'
    : 'Gebäude prüfen';
</script>

<section class="next-actions" aria-labelledby="next-actions-title">
  <header>
    <span>Deine nächsten Schritte</span>
    <h2 id="next-actions-title">Das solltest du jetzt tun</h2>
    <p>Nach Wichtigkeit sortiert – maximal drei klare Aktionen für deine Insel.</p>
  </header>
  <ol>
    {#each actions as action, index}
      <li class:stable={action.kind === 'stable'}>
        <span class="number" aria-hidden="true">{index + 1}</span>
        <div><strong>{action.title}</strong><p>{action.detail}</p></div>
        {#if action.kind !== 'stable'}<button onclick={() => onAction(action)}>{actionLabel(action)}</button>{/if}
      </li>
    {/each}
  </ol>
</section>

<style>
  .next-actions { margin-bottom: 18px; overflow: hidden; border: 1px solid #c8b78f; border-radius: 10px; background: #fff9ed; box-shadow: 0 5px 16px rgb(65 53 28 / 9%); }
  header { padding: 19px 22px 15px; border-bottom: 1px solid #e1d4b8; background: #f3e4c4; }
  header > span { color: #765d2c; font-size: 11px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
  h2 { margin: 4px 0 0; font-size: 21px; }
  p { margin: 5px 0 0; color: #686157; font-size: 13px; line-height: 1.45; }
  ol { margin: 0; padding: 0; list-style: none; }
  li { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 14px; padding: 15px 22px; border-top: 1px solid #eadfc8; }
  li:first-child { border-top: 0; }
  li.stable { background: #eff8f1; }
  .number { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 50%; background: #234f45; color: #fff; font-size: 13px; font-weight: 800; }
  strong { color: #2b2925; font-size: 15px; }
  button { min-height: 38px; padding: 0 13px; border: 0; border-radius: 5px; background: #c94c32; color: #fff; cursor: pointer; font: inherit; font-size: 13px; font-weight: 750; }
  button:hover, button:focus-visible { background: #a93c28; outline: 2px solid #7f2b20; outline-offset: 2px; }
</style>
