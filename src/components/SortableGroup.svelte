<script>
	import { createPopperActions } from "svelte-popperjs";
  import { createEventDispatcher } from 'svelte';
	import { dndzone } from "svelte-dnd-action";
	import { flip } from "svelte/animate";

  export let group;
  export let itemComponent;

	const dispatch = createEventDispatcher();
	const [popperRef, popperContent] = createPopperActions();
	const popperOptions = { placement: "right-start" };
	const flipDurationMs = 300;
	let dragDisabled = true;

  let editing = false;

	async function removeItem(item) {
		const index = group.items.indexOf(item);
		if (index > -1) {
			group.items.splice(index, 1);
			dispatch('sync');
		}
	}

	function startEdit() {
		editing = true;
	}

	function stopEdit() {
		editing = false;
		dispatch('sync');
	}

	function handleDndConsider(e) {
		group.items = e.detail.items;
	}

	function handleDndFinalize(e) {
		group.items = e.detail.items;
		if (e.detail.info.source == "pointer") {
			dragDisabled = true;
		}

		dispatch('sync');
	}

	function startDrag(e) {
		// preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
		e.preventDefault();
		dragDisabled = false;
	}
</script>

<div class="group">
  <header>
    {#if editing == true}
      <form on:submit|preventDefault={stopEdit}>
        <input
          placeholder="Group name"
          bind:value={group.title}
          on:blur={stopEdit}
        />
        <input type="submit" hidden />
      </form>
    {:else}
      <h5 class="emphasis">
				{group.title}
			</h5>
    {/if}
		<button class="material-icons menu [ md-18 no-gutters ]" use:popperRef>more_vert</button>
		<div class="tooltip" use:popperContent={popperOptions}>
			<ul>
				<li>
					<button class="no-gutters" on:click={startEdit}>
						<i class="material-icons [ md-18 warning ]">edit</i>
						Edit group
					</button>
				</li>
				<li>
					<button class="no-gutters" on:click={dispatch('remove', group)}>
						<i class="material-icons [ md-18 alert ]">delete</i>
						Delete group
					</button>
				</li>
			</ul>
			<div class="arrow" data-popper-arrow />
		</div>
  </header>
  <ul 
		use:dndzone={{
			items: group.items,
			flipDurationMs,
			dragDisabled,
			dropTargetStyle: {},
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
>
    {#each group.items as item(item["id"])}
      <li animate:flip={{ duration: flipDurationMs }}>
					<div
						aria-label="drag-handle"
						class="drag-handle material-icons md-18 [ hint no-gutters ]"
						style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
						on:mousedown={startDrag}
						on:touchstart={startDrag}
					>
						drag_indicator
					</div>
        <svelte:component this={itemComponent} {item} on:remove={removeItem(item)} />
      </li>
    {/each}
  </ul>
</div>

<style>
	header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	li {
		position: relative;
	}

	.menu {
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.25s ease-in-out;
	}

	header:hover .menu,
	.menu:focus {
		pointer-events: all;
		opacity: 1;
	}

	.tooltip {
		visibility: hidden;
	}

	.menu:focus + .tooltip,
	.tooltip:active {
		visibility: visible;
	}

	.tooltip > ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-2);
	}

	.tooltip li {
		display: flex;
		align-items: center;
	}

	.tooltip li:hover {
		filter: brightness(150%);
	}

	/* Hack for arrow visibility */
	.tooltip > .arrow::before {
		visibility: hidden;
	}

	.menu:focus + .tooltip > .arrow::before,
	.tooltip:active > .arrow::before {
		visibility: visible;
	}

	.drag-handle {
		position: absolute;
		right: 100%;
		top: 50%;	
		transform: translateY(-50%);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.25s ease-in-out;
	}

	li:hover > .drag-handle,
	.drag-handle:hover {
		pointer-events: all;
		opacity: 1;
	}
</style>