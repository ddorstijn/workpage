<script>
  export let item;
</script>

<li class="item">
  <a href={item.url}>{item.name}</a>
</li>

<style>
	.item {
		position: relative;
		width: max-content;

		display: flex;
	}

	.item > a {
		font-size: 1.6rem;
		font-weight: 300;
		line-height: 1.2em;

		color: var(--color-grey);
	}
</style>