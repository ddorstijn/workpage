<script>
  import { createEventDispatcher } from 'svelte';
  export let item;

	const dispatch = createEventDispatcher();
</script>

<div class="item">
  <a class="subtitle2" href={item.url}>{item.title}</a>
  <div class="item-actions">
    <button class="material-icons [ md-14 no-gutters ] [ alert ]" on:click={dispatch('remove', {item})} >
      close
    </button>
  </div>
</div>

<style>
	.item {
		position: relative;
		width: max-content;

		display: flex;
		font-size: 0.75rem;
	}

	.item > a {
		text-decoration: none;
		color: inherit;
	}

	.item:hover > .item-actions {
		opacity: 1;
	}
</style>