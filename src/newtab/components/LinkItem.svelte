<script>
  export let item;
</script>

<div class="item">
  <a class="subtitle2" href={item.url}>{item.title}</a>
  <div class="item-actions">
    <button class="material-icons" >
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

	.item:hover {
		filter: brightness(125%);
	}

	.item > a {
		text-decoration: none;
		color: inherit;
	}

	.item:hover > .item-actions {
		opacity: 1;
	}
</style>