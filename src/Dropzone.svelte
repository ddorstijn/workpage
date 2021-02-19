 <script>
  import { dndzone } from 'svelte-dnd-action';

  let items = [];
  export let itemComponent;
  export let onDrop;
  export let type;

  function handleConsider(e) {
    items = e.detail.items;
  }

  function handleFinalize(e) {
    onDrop(e.detail.items, e.detail.info);
    items = [];
  }
</script>

<section use:dndzone={{items, type, dropTargetStyle: {display: 'block', border: '1px solid cyan'}}} on:consider={handleConsider} on:finalize={handleFinalize}>
  {#if items.length === 0}
    <slot></slot>
  {/if}

  {#each items as item(item['id'])}
    <svelte:component this={itemComponent} {item} />
  {/each}
</section>

<style lang="postcss">
  section {
    padding: 0.4em;
    display: none;
  }
</style>
