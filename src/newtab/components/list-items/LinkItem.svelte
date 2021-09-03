<script>
  export let item;
</script>

<li class="item">
  <a href={item.url}>{item.name}</a>
	<button class="menu-btn button material-icons">more_vert</button>
</li>

<style>
	.item {
		position: relative;
		margin-bottom: 0.25rem;

		display: flex;
	}

	.item > a {
		font-size: 1.6rem;
		font-weight: 300;
		line-height: 1.2em;

		color: var(--color-grey);
	}

	.menu-btn {
		margin-left: auto;
		padding: 0;

		background-color: transparent;
		font-size: 16px;
		opacity: 0;
	}

	li:hover .menu-btn {
		opacity: 1;
	}
</style>