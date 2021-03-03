<script>
	import { createEventDispatcher } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import { clickOutside } from "./click_outside.js";

	import ProjectItem from "./ProjectItem.svelte";
	import { currentID } from "./store.js";

	export let item;

	const dispatch = createEventDispatcher();
	const [popperRef, popperContent] = createPopperActions();

	let creating = false;
	let editing = false;
	let showTooltip = false;

	function addLink(evt) {
		const fd = new FormData(evt.target);
		const title = fd.get("title");

		item.items = [
			...item.items, {
				id: $currentID++,
				title: title,
				showOptions: false,
			},
		];

		creating = false;
	}

	function onRemove(link) {
		if (item.items.length == 1) {
			alert("You need at least one project");
			return;
		}

		item.items.splice(item.items.indexOf(link), 1);
		item.items = item.items;
	}
</script>

<div class="list-card [ w-full ]">
	<header class="px-4 text-2xl bg-green">
		{#if editing}
			<form on:submit|preventDefault={() => (editing = false)}>
				<input
					id="card-header"
					name="card-header"
					placeholder="List name"
					bind:value={item.title}
					on:blur={() => (editing = false)}
				/>
			</form>
		{:else}
			<h2 class="py-2">{item.title}</h2>
		{/if}
		<button id="reference" use:popperRef on:click={() => (showTooltip = true)}>
			<svg class="h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
			</svg>
		</button>
		{#if showTooltip}
			<div class="tooltip" use:popperContent={{ placement: 'left' }} use:clickOutside on:click_outside={() => (showTooltip = false)}>
				<ul dir="RTL">
					<li title="Add link" on:click={() => { creating = true; showTooltip = false; }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
						</svg>
					</li>
					<li title="Edit section title" on:click={() => { editing = true; showTooltip = false; }}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
						</svg>
					</li>
					<li title="Remove section" on:click={() => dispatch('remove')}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
						</svg>
					</li>
				</ul>
				<div data-popper-arrow />
			</div>
		{:else if creating}
			<div class="tooltip [ w-96 ]" use:popperContent={{ placement: 'bottom-end' }} use:clickOutside on:click_outside={() => (creating = false)}>
				<form on:submit|preventDefault={(evt) => addLink(evt)} id="create-link">
					<label for="title" class="justify-self-end">Title</label>
					<input id="title" type="text" name="title" />
					<button type="submit" class="col-span-2 mt-4"> Add bookmark </button>
				</form>
				<div data-popper-arrow />
			</div>
		{/if}
	</header>
	<div class="card-content bg-gray-900 text-gray-100">
		{#each item.items as project}
			<ProjectItem item={project} on:remove={onRemove} />
		{/each}
	</div>
</div>

<style lang="postcss">
	.list-card {
		@apply flex flex-col gap-2;
	}

	.list-card > header {
		@apply flex justify-between items-center;
	}

	#reference {
		height: 100%;
		display: flex;
	}

	.tooltip {
		@apply bg-gray-200 text-gray-800 py-1 px-2 rounded shadow-lg;
	}

	.tooltip > form {
		display: grid;
		grid-template-columns: 1fr 3fr;
		align-items: center;
		@apply gap-x-8 gap-y-2 p-4 text-lg;
	}

	.tooltip > ul {
		@apply flex gap-3;
	}

	.tooltip > ul svg {
		@apply h-6;
	}

	[data-popper-arrow]::before {
		@apply bg-gray-200;
	}

	.card-content {
		@apply p-2;
	}
</style>
