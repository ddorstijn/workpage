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
		font-size: smaller;
	}

	.item > a {
		color: inherit;
	}
</style>