<script lang="ts">
  export let text = '';
  export let enabled = true;
</script>

{#if enabled}
  <button type="button" class="tip" aria-label={text}>?
    <span class="bubble" role="tooltip">{text}</span>
  </button>
{/if}

<style>
  .tip{position:relative;display:inline-grid;place-items:center;width:18px;height:18px;padding:0;border:0;border-radius:50%;background:#e8dcc3;color:#47635b;font:700 12px/1 sans-serif;cursor:help;margin-left:5px}
  .bubble{visibility:hidden;opacity:0;position:absolute;z-index:50;left:50%;bottom:calc(100% + 8px);transform:translateX(-50%);width:min(280px,70vw);padding:10px 12px;border-radius:9px;background:#203c35;color:white;font:400 13px/1.4 system-ui;box-shadow:0 8px 24px #10251f40;transition:.15s;pointer-events:none}
  .tip:hover .bubble,.tip:focus .bubble{visibility:visible;opacity:1}
</style>
