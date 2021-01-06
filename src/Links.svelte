<script>
	import ListCard from './ListCard.svelte';
	
	let currentID = 0;
	let lists = [];
	let creating = false;
	
	function addSection() {
		if (lists.length >= 5) {
			return;
		}

		lists = [...lists, { 
			title: 'New category',
			items: [],
		}]
	};
	
	function removeSection(section) {
		let index = lists.indexOf(section);
		if (index === 0) {
			lists = lists.slice(1);
		} else {
			lists = lists.slice(index, index + 1);
		}
	};
</script>

<style>
#links {
}

#links > ul {
	display: flex;
	justify-content: center;
	gap: var(--space-12);
}

.links-list > :global(.list-card) {
	margin-top: var(--space-16);
}

#links > button {
	width: 100%;
	margin-top:  var(--space-12);

	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--space-1);
}

#links > button > svg {
	height: 1.25rem;
	color: var(--tone-900);
}
</style>

<!-- Links -->
<article id="links">
	<ul class="links-list">
		{#each lists as list}
			<ListCard class="list-card" title={list.title} items={list.items} on:remove="{() => removeSection(list)}" />
		{/each}
	</ul>
	<button class="links-add" on:click={addSection}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
		</svg>
		Add section
	</button>
</article>
