<script lang="ts">
  import { tick } from 'svelte';

  export let text = '';
  export let enabled = true;

  let button: HTMLButtonElement;
  let bubble: HTMLSpanElement;
  let open = false;
  let left = 12;
  let top = 12;
  let width = 280;

  async function show() {
    open = true;
    await tick();
    const rect = button.getBoundingClientRect();
    width = Math.min(390, Math.max(56, window.innerWidth - 24));
    left = Math.min(Math.max(12, rect.left), Math.max(12, window.innerWidth - width - 12));
    const bubbleHeight = bubble.offsetHeight;
    const above = rect.top - bubbleHeight - 8;
    const below = rect.bottom + 8;
    top = above >= 12 ? above : below + bubbleHeight <= window.innerHeight - 12 ? below : 12;
  }
</script>

{#if enabled}
  <button bind:this={button} type="button" class="tip" aria-label={text} aria-expanded={open} onmouseenter={show} onmouseleave={() => (open = false)} onfocus={show} onblur={() => (open = false)}>?</button>
  {#if open}<span bind:this={bubble} class="bubble" role="tooltip" style={`left:${left}px;top:${top}px;width:${width}px`}>{text}</span>{/if}
{/if}

<style>
  .tip{display:inline-grid;place-items:center;width:18px;height:18px;padding:0;border:1px solid #aeb8bd;border-radius:50%;background:#fff;color:#40515a;font:700 12px/1 sans-serif;cursor:help;margin-left:5px}
  .bubble{position:fixed;z-index:1000;max-height:calc(100vh - 24px);overflow:auto;padding:12px;border-radius:2px;background:#24353f;color:white;font:400 13px/1.45 system-ui;box-shadow:0 8px 24px #10251f30;pointer-events:none;text-align:left}
</style>
