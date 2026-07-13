<script lang="ts">
  import { onMount, tick } from 'svelte';

  export let id: string;
  export let subject: string;
  export let blocks: { title?: string; formula: string[]; result?: string }[] = [];
  export let notes: string[] = [];
  export let enabled = true;

  let trigger: HTMLButtonElement;
  let popover: HTMLDivElement;
  let hoverTip: HTMLSpanElement;
  let hoverOpen = false;
  let popoverOpen = false;
  let hoverLeft = 12;
  let hoverTop = 12;

  const viewportMargin = 16;
  const gap = 8;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), Math.max(min, max));
  }

  async function showHover() {
    if (popoverOpen) return;
    hoverOpen = true;
    await tick();
    if (!hoverTip || !trigger) return;
    const triggerRect = trigger.getBoundingClientRect();
    const tipRect = hoverTip.getBoundingClientRect();
    hoverLeft = clamp(triggerRect.left + triggerRect.width / 2 - tipRect.width / 2, viewportMargin, window.innerWidth - tipRect.width - viewportMargin);
    const above = triggerRect.top - tipRect.height - gap;
    hoverTop = above >= viewportMargin ? above : triggerRect.bottom + gap;
  }

  function hideHover() {
    hoverOpen = false;
  }

  function positionPopover() {
    if (!popover?.matches(':popover-open') || !trigger) return;
    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const maxLeft = window.innerWidth - popoverRect.width - viewportMargin;
    const maxTop = window.innerHeight - popoverRect.height - viewportMargin;
    const below = triggerRect.bottom + gap;
    const above = triggerRect.top - popoverRect.height - gap;

    popover.style.left = `${clamp(triggerRect.left, viewportMargin, maxLeft)}px`;
    popover.style.top = `${below + popoverRect.height <= window.innerHeight - viewportMargin ? below : above >= viewportMargin ? above : clamp(below, viewportMargin, maxTop)}px`;
  }

  function syncPopoverState() {
    popoverOpen = popover.matches(':popover-open');
    if (popoverOpen) {
      hideHover();
      requestAnimationFrame(positionPopover);
    }
  }

  function closeOnEscape(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    hideHover();
    if (popover?.matches(':popover-open')) popover.hidePopover();
  }

  onMount(() => {
    const reposition = () => positionPopover();
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('keydown', closeOnEscape);
    };
  });
</script>

{#if enabled}
  <span class="calculation-control" role="group" onmouseenter={showHover} onmouseleave={hideHover}>
    <button
      bind:this={trigger}
      type="button"
      class="calculation-trigger"
      aria-label={`Berechnung für ${subject} anzeigen`}
      aria-controls={id}
      aria-expanded={popoverOpen}
      popovertarget={id}
      onclick={hideHover}
      onkeydown={closeOnEscape}
      onfocus={showHover}
      onblur={hideHover}
    >?</button>
    {#if hoverOpen}
      <span bind:this={hoverTip} class="hover-tip" role="tooltip" style={`left:${hoverLeft}px;top:${hoverTop}px`}>Berechnung anzeigen</span>
    {/if}
  </span>

  <div bind:this={popover} {id} class="calculation-popover" popover="auto" role="dialog" aria-labelledby={`${id}-title`} ontoggle={syncPopoverState}>
    <h4 id={`${id}-title`}>Berechnung</h4>
    <div class="calculation-subject">{subject}</div>
    {#each blocks as block}
      <div class="calculation-block">
        {#if block.title}<strong>{block.title}</strong>{/if}
        <div class="calculation-formula">
          {#each block.formula as line}<span>{line}</span>{/each}
        </div>
        {#if block.result}<div class="calculation-result">{block.result}</div>{/if}
      </div>
    {/each}
    {#if notes.length}
      <div class="calculation-note">{#each notes as note}<span>{note}</span>{/each}</div>
    {/if}
  </div>
{/if}

<style>
  .calculation-control { display: inline-flex; margin-left: 5px; }
  .calculation-trigger { display: inline-grid; place-items: center; width: 18px; height: 18px; padding: 0; border: 1px solid #aeb8bd; border-radius: 50%; background: #fff; color: #40515a; font: 700 12px/1 sans-serif; cursor: pointer; }
  .calculation-trigger:hover, .calculation-trigger:focus-visible { border-color: #506d7c; color: #203746; outline: 2px solid rgb(80 109 124 / 18%); outline-offset: 1px; }
  .hover-tip { position: fixed; z-index: 1100; max-width: min(220px, calc(100vw - 32px)); padding: 6px 8px; overflow-wrap: anywhere; border-radius: 3px; background: #203746; color: #fff; font: 400 12px/1.35 system-ui; text-align: left; pointer-events: none; }
  .calculation-popover { position: fixed; inset: auto; width: max-content; min-width: 260px; max-width: min(360px, calc(100vw - 32px)); max-height: calc(100vh - 32px); margin: 0; padding: 12px 14px; overflow-x: hidden; overflow-y: auto; white-space: normal; overflow-wrap: anywhere; border: 1px solid #405866; border-radius: 4px; background: #203746; color: #fff; box-shadow: 0 6px 18px rgb(0 0 0 / 20%); font: 400 13px/1.45 system-ui; text-align: left; }
  .calculation-popover h4 { margin: 0 0 10px; font-size: 14px; }
  .calculation-subject { margin: -7px 0 12px; color: #d6e0e5; font-size: 12px; }
  .calculation-block + .calculation-block { margin-top: 12px; padding-top: 10px; border-top: 1px solid rgb(255 255 255 / 20%); }
  .calculation-formula { margin: 3px 0 0; }
  .calculation-formula span, .calculation-note span { display: block; }
  .calculation-result { margin-top: 4px; font-weight: 700; }
  .calculation-note { margin-top: 12px; padding-top: 10px; border-top: 1px solid rgb(255 255 255 / 20%); font-size: 12px; opacity: .88; }

  @media (max-width: 320px) {
    .calculation-popover { min-width: 0; }
  }
</style>
