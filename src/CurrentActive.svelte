<script>
  import List from "./List.svelte";

  export let name;
  export let items;
  export let component;
  export let type; 
  export let onDrop;

  function onRemove(item) {
    items.splice(items.indexOf(item), 1);
    items = items;
  };
</script>

<section class="current-wrapper">
  <h2 class="text-sm font-bold">Current {name}:</h2>
  <div class="px-4 py-1 pt-2"> 
    <List {items} itemComponent={component} {type} {onDrop} {onRemove}>
      <p class="text-sm text-gray-700">You currently do not have an active {name} you are working on. Drag an item here to start.</p>
    </List>
  </div>
</section>

<style lang="postcss">
  .current-wrapper {
    @apply p-4 rounded-lg bg-gray-100
  }
</style>
