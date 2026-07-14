<script lang="ts">
  export let open = false;
  export let onClose: () => void;
  export let onSkip: () => void;
  export let onStart: () => void;

  const steps = [
    { number: '1', title: 'Inselstand erfassen', text: 'Trage zuerst die Gebäude ein, die auf deiner Kolonialinsel bereits gebaut sind. Anzahl, Effizienz und Arbeitsmodus reichen für den Start.' },
    { number: '2', title: 'Produktionsziel wählen', text: 'Wähle anschließend, was du ausbauen möchtest. Der Planer rechnet die benötigte Produktionskette bis zu den Rohstoffen zurück.' },
    { number: '3', title: 'Bauvorschläge umsetzen', text: 'Im Inselstand siehst du Engpässe, fehlende Rohstoffe und maximal drei konkrete nächste Schritte. Geplante Gebäude bleiben klar von gebauten getrennt.' }
  ];
  let step = 0;
  let wasOpen = false;
  $: if (open && !wasOpen) step = 0;
  $: wasOpen = open;
</script>

{#if open}
  <div class="backdrop" role="presentation" onkeydown={(event) => { if (event.key === 'Escape') onClose(); }}>
    <dialog open aria-modal="true" aria-labelledby="onboarding-title">
      <div class="progress" aria-label={`Schritt ${step + 1} von ${steps.length}`}>
        {#each steps as item, index}<span class:active={index <= step}>{item.number}</span>{/each}
      </div>
      <span class="eyebrow">Schnellstart für Tropico-Spieler</span>
      <h2 id="onboarding-title">{steps[step].title}</h2>
      <p>{steps[step].text}</p>
      <div class="actions">
        <button class="skip" onclick={onSkip}>Überspringen</button>
        <div>
          {#if step > 0}<button class="back" onclick={() => (step -= 1)}>Zurück</button>{/if}
          {#if step < steps.length - 1}<button class="primary" onclick={() => (step += 1)}>Weiter</button>{:else}<button class="primary" onclick={onStart}>Jetzt Inselstand erfassen</button>{/if}
        </div>
      </div>
    </dialog>
  </div>
{/if}

<style>
  .backdrop { position: fixed; inset: 0; z-index: 1100; display: grid; place-items: center; padding: 24px; background: rgb(24 35 31 / 62%); }
  dialog { position: static; width: min(620px, 100%); margin: 0; padding: 30px; border: 1px solid #a99b7c; border-top: 6px solid #d9a441; border-radius: 12px; background: #fff9ed; color: #2b2925; box-shadow: 0 24px 60px rgb(0 0 0 / 30%); }
  .progress { display: flex; gap: 8px; margin-bottom: 24px; }
  .progress span { display: grid; width: 32px; height: 32px; place-items: center; border: 2px solid #b9ae96; border-radius: 50%; color: #817866; font-size: 13px; font-weight: 800; }
  .progress span.active { border-color: #234f45; background: #234f45; color: #fff; }
  .eyebrow { color: #8b6323; font-size: 11px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
  h2 { margin: 6px 0 0; font-size: 27px; }
  p { min-height: 66px; margin: 12px 0 0; color: #655f55; font-size: 15px; line-height: 1.55; }
  .actions, .actions > div { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .actions { margin-top: 28px; }
  button { min-height: 40px; padding: 0 14px; border: 0; border-radius: 5px; cursor: pointer; font: inherit; font-weight: 750; }
  .primary { background: #c94c32; color: #fff; }
  .primary:hover, .primary:focus-visible { background: #a93c28; outline: 2px solid #7f2b20; outline-offset: 2px; }
  .back { border: 1px solid #8f846e; background: transparent; color: #3d3a34; }
  .skip { padding-left: 0; background: transparent; color: #6b665d; text-decoration: underline; }
  .back:hover, .back:focus-visible, .skip:hover, .skip:focus-visible { outline: 2px solid #234f45; outline-offset: 2px; }
</style>
