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
  .tip{position:relative;display:inline-grid;place-items:center;width:18px;height:18px;padding:0;border:1px solid #aeb8bd;border-radius:50%;background:#fff;color:#40515a;font:700 12px/1 sans-serif;cursor:help;margin-left:5px}
  .bubble{visibility:hidden;opacity:0;position:absolute;z-index:50;left:0;bottom:calc(100% + 8px);width:min(390px,80vw);padding:12px;border-radius:2px;background:#24353f;color:white;font:400 13px/1.45 system-ui;box-shadow:0 8px 24px #10251f30;transition:.15s;pointer-events:none;text-align:left}
  .tip:hover .bubble,.tip:focus .bubble{visibility:visible;opacity:1}
</style>
