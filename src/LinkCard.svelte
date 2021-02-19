<script>
	import { createEventDispatcher} from 'svelte';
	import { createPopperActions } from 'svelte-popperjs';
	import { clickOutside } from './click_outside.js';
	import { currentID } from './store.js';

	import List from "./List.svelte";
	import LinkItem from "./LinkItem.svelte";

	export let item;

	let creating = false;
	let editing = false;
	let showTooltip = false;
	const colors = ["red", "orange", "yellow", "green", "aqua", "blue", "purple"];

	const dispatch = createEventDispatcher();

	function addLink(evt) {
		const fd = new FormData(evt.target);
		const title = fd.get('title');
		const url = fd.get('url');

		item.links = [...item.links, {
				id: $currentID++,
				title: title,
				url: url,
		}];

		creating = false;
	};

	function onRemove(link) {
		item.links.splice(item.links.indexOf(link), 1);
		item.links = item.links;
	}

	function onDrop(newitems) {
		item.links = newitems;
	};

	const [ popperRef, popperContent ] = createPopperActions();
</script>

<div class="list-card [ w-1/4 ]">
	<header class="px-4 text-2xl"  class:red={item.color === "red"} class:orange={item.color === "orange"} class:yellow={item.color === "yellow"} class:green={item.color === "green"} class:aqua={item.color === "aqua"} class:blue={item.color === "blue"} class:purple={item.color === "purple"}>
		{#if editing}
			<form on:submit|preventDefault="{() => editing = false}">
				<input id="card-header" name="card-header" placeholder="List name" bind:value="{item.title}" on:blur="{() => editing = false}" />
			</form>
		{:else}
			<h2 class="py-2">{item.title}</h2>
		{/if}
		<button id="reference" use:popperRef on:click="{() => showTooltip = true}">
			<svg class="h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
			</svg>
		</button>
		{#if showTooltip}
			<div class="tooltip" use:popperContent="{{ placement: 'left' }}" use:clickOutside on:click_outside="{() => showTooltip = false}">
				<ul dir="RTL">
					<li class="hover:text-green" title="Add link" on:click="{() => {creating = true; showTooltip = false}}">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> 
							<path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /> 
						</svg>
					</li>
					<li title="Change color" on:click="{() => item.color = colors[colors.findIndex(c => c === item.color) + 1]}">
						<svg class="{item.color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd" />
						</svg>
					</li>
					<li class="hover:text-blue" title="Edit section title" on:click="{() => {editing = true; showTooltip = false}}">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> 
							<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /> 
						</svg>
					</li>
					<li class="hover:text-red" title="Remove section" on:click="{() => dispatch('remove')}">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /> 
						</svg>
					</li>
				</ul>
				<div data-popper-arrow />
			</div>
		{:else if creating}
			<div class="tooltip [ w-96 ]" use:popperContent={{ placement: 'bottom-end' }} use:clickOutside on:click_outside="{() => creating = false}">
				<form on:submit|preventDefault="{evt => addLink(evt)}" id="create-link">
					<label for="title" class="justify-self-end">Title</label>
					<input id="title" type="text" name="title" required />

					<label for="url" class="justify-self-end">URL</label>
					<input id="url" type="url" name="url" required />

					<button type="submit" class="col-span-2 mt-4">
						Add bookmark
					</button>
				</form>
				<div data-popper-arrow />
			</div>
		{/if}
	</header>
	<div class="card-content bg-gray-900 text-gray-100">
		<List items={item.links} itemComponent={LinkItem} type="linkItem" gap="0" {onDrop} {onRemove}>
			<p>There are no items here yet</p>
		</List>
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

	.tooltip li {
		cursor: pointer;
	}

	.tooltip > ul svg {
		@apply h-6;
	}

	[data-popper-arrow]::before {
		@apply bg-gray-200;
	}

	.card-content {
		@apply px-4 py-2;
	}

	.red {
		@apply bg-red;
	} 

	.orange {
		@apply bg-orange;
	}

	.yellow {
		@apply bg-yellow;
	}

	.green {
		@apply bg-green;
	}

	.aqua {
		@apply bg-aqua;
	}

	.blue {
		@apply bg-blue;
	}

	.purple {
		@apply bg-purple;
	}
</style>
