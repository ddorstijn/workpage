<script>
	import { activeProject } from "../../store.js";
  	
	export let item;
  	
	function setActive(item) {
		$activeProject = item.name;
	}
</script>

<div class="project-item">
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a href="#" on:click={setActive(item)}>{item.name}</a>
</div>

<style>
	.project-item {
		position: relative;
		width: max-content;

		display: flex;
		align-items: center;
	}

	.project-item:hover {
		filter: brightness(125%);
	}
</style>