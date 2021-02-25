<script>
	import List from './List.svelte';
	import LinkCard from './LinkCard.svelte';
	import { currentID, activeId } from './store.js';

	let links = [];
	activeId.subscribe(val => links = JSON.parse(localStorage.getItem(`links${val}`)) || []);
	$: localStorage.setItem(`links${$activeId}`, JSON.stringify(links));

	function addSection() {
		// Max lists
		if (links.length >= 4) {
			return;
		}

		links = [...links, {
			id: $currentID++,
			title: 'New category',
			links: [],
			color: "green",
		}]
	};

	function onRemove(section) {
		links.splice(links.indexOf(section), 1);
	};

	function onDrop(items) {
		links = items;
	}
</script>

<article id="links">
	{#if links.length}
		<div class="mt-12">
			<List horizontal gap="12" bind:items={links} itemComponent={LinkCard} {onDrop} {onRemove} type="linkCard" />
		</div>
	{/if}
	<button class="w-full mt-12" on:click={addSection}>
		<svg class="h-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
		</svg>
		Add section
	</button>
</article>
