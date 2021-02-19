 <script>
  import {dndzone} from 'svelte-dnd-action';

  export let items;
  export let itemComponent;
  export let type = "default";
	export let onDrop = function() {};
	export let onRemove = function() {};
  export let horizontal = false;
	export let disable = false;
  export let gap = 2;

  function handleConsider(e) {
    items = e.detail.items;
  }

  function handleFinalize(e) {
    onDrop(e.detail.items, e.detail.info);
  }

  function handleRemove(item) {
    onRemove(item);
  }
</script>

<section 
  class:vertical={!horizontal}
  class:horizontal={horizontal}
  class={"gap-" + gap} 
  use:dndzone={{
    items, 
    type, 
    dragDisabled: !items.length || disable, 
    dropTargetStyle: {}
  }}
  on:consider={handleConsider}
  on:finalize={handleFinalize}
>
  {#if items.length === 0}
    <slot></slot>
  {/if}

  {#each items as item(item['id'])}
		<svelte:component this={itemComponent} bind:item={item} on:remove={handleRemove(item)} {disable} />
  {/each}
</section>

<style lang="postcss">
  .vertical {
    @apply flex flex-col;
  }

  .horizontal {
    @apply flex justify-center;
  }
</style>
