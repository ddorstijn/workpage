<script>
	import { activeId } from "../store.js";
  import { createEventDispatcher } from 'svelte';

  export let item;

	const dispatch = createEventDispatcher();
  let editing = false;

	function setActive(item) {
		$activeId = item.id;
		open = false;
	}

	function startEdit() {
		editing = true;
	}

	function stopEdit() {
		editing = false;
		dispatch('sync');
	}
</script>

<div class="project-item">
  {#if editing}
    <form on:submit|preventDefault={stopEdit}>
      <input
        placeholder="Item name"
        bind:value={item.title}
        on:blur={stopEdit}
      />
      <input type="submit" hidden />
    </form>
  {:else}
    <span on:click={setActive(item)}>{item.title}</span>
  {/if}
  <div class="item-actions">
    <button class="material-icons [ md-14 no-gutters ] [ alert ]" on:click={dispatch('remove', item)}>
      delete
    </button>
    <button class="material-icons [ md-14 no-gutters ] [ warning ]" on:click={startEdit}>
      edit
    </button>
  </div>
</div>

<style>
	.project-item {
		position: relative;
		width: max-content;

		display: flex;
		align-items: center;
	}

	.project-item > span {
		cursor: pointer;
	}

	.project-item:hover > .item-actions {
		opacity: 1;
	}
</style>