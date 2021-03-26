<script>
	import { currentId, activeId } from "../store.js";

	import { dndzone } from "svelte-dnd-action";
	import { flip } from "svelte/animate";

	import { createPopperActions } from "svelte-popperjs";
	const [popperRef, popperContent] = createPopperActions();
	const popperOptions = {
		placement: "bottom-start",
		modifiers: [{ name: "offset", options: { offset: [0, 4] } }],
	};

	// -- Members -- \\
	let showTooltip = false;
	let viewDone = false;
	let todo = [];
	let done = [];

	let dragDisabled = true;
	const flipDurationMs = 300;

	// -- Initialization -- \\
	activeId.subscribe((val) => {
		let todoId = `todo-${val}`;
		let doneId = `done-${val}`;
		chrome.storage.sync.get([todoId, doneId], function (result) {
			todo = result[todoId] ?? [];
			done = result[doneId] ?? [];

			syncTodo();
			syncDone();
		});
	});

	// -- Synchronization -- \\
	async function syncTodo() {
		try {
			chrome.storage.sync.set({ [`todo-${$activeId}`]: todo });
			todo = todo;
		} catch (e) {
			console.error(e);
		}
	}

	async function syncDone() {
		try {
			chrome.storage.sync.set({ [`done-${$activeId}`]: done });
			done = done;
		} catch (e) {
			console.error(e);
		}
	}

	// -- Functions -- \\
	async function addTodo() {
		todo.unshift({
			id: $currentId++,
			title: this.querySelector("input[type='text']").value,
			due: this.querySelector("input[type='date']")?.value,
		});

		this.reset();
		syncTodo();
	}

	async function markDone(item) {
		const index = todo.indexOf(item);
		if (index > -1) {
			const [item] = todo.splice(index, 1);
			done.unshift({
				id: item.id,
				title: item.title,
				finished: new Date().toISOString().slice(0, 10),
			});

			syncTodo();
			syncDone();
		}
	}

	function handleDndConsider(e) {
		todo = e.detail.items;
	}

	function handleDndFinalize(e) {
		todo = e.detail.items;
		if (e.detail.info.source == "pointer") {
			dragDisabled = true;
		}
	}

	function startDrag(e) {
		// preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
		e.preventDefault();
		dragDisabled = false;
	}
</script>

<article>
	<header>
		<form on:submit|preventDefault={addTodo}>
			<label>
				<input type="text" placeholder="Write a new task" required />
				<span>Write a new task</span>
			</label>
			<button
				class="material-icons [ no-gutters ]"
				type="button"
				title="Add due date"
				use:popperRef
				on:click={() => showTooltip = !showTooltip}
			>
				event
			</button>
			{#if showTooltip}
				<div
					class="tooltip [ surface elevation-24 ]"
					use:popperContent={popperOptions}
				>
					<input type="date" />
					<div class="arrow" data-popper-arrow />
				</div>
			{/if}
			<input type="submit" hidden />
		</form>
	</header>
	<ul
		class="todo-wrapper"
		use:dndzone={{
			items: todo,
			flipDurationMs,
			dragDisabled,
			dropTargetStyle: {},
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each todo as item (item.id)}
			<li class="todo-item" animate:flip={{ duration: flipDurationMs }}>
				<div class="todo-item__body">
					<button
						class="todo-item__title [ no-gutters ]"
						on:click={markDone(item)}
					>
						<span class="line-hover">{item.title}</span>
					</button>
					{#if item.due}
						<span class="todo-item__due [ hint ]">
							<i class="material-icons md-12">event</i>
							{item.due}
						</span>
					{/if}
				</div>
				<div
					aria-label="drag-handle"
					class="drag-handle material-icons md-18 [ hint no-gutters ]"
					style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
					on:mousedown={startDrag}
					on:touchstart={startDrag}
				>
					drag_indicator
				</div>
			</li>
		{/each}
	</ul>
	<button class="task-actions" on:click={() => (viewDone = !viewDone)} title="WIP">
		<i class="material-icons md-18">checklist</i>
		<span>History</span>
	</button>
</article>

<style>
	article {
		height: 100%;
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	header {
		margin-bottom: var(--space-4);
	}

	form {
		flex-direction: row;
		align-items: flex-end;
		gap: var(--space-4);
	}

	label {
		flex: 1;
	}

	form input[type="text"] {
		width: 100%;
	}

	.todo-wrapper {
		min-height: 0;
		flex: 1;
		overflow: auto;
	}

	.todo-item {
		padding: var(--space-2);
		padding-left: var(--space-4);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.todo-item__title {
		display: block;
		font-size: 1rem;
		font-weight: 400;
	}

	.todo-item__due {
		display: flex;
		align-items: center;
		gap: var(--space-1);

		font-size: 0.75rem;
		line-height: 16px;
	}

	.task-actions {
		align-self: center;
	}

	.drag-handle {
		opacity: 0;
		transition: opacity 0.25s ease-in-out;
	}

	.todo-item:hover > .drag-handle {
		opacity: 1;
	}

	.line-hover {
		position: relative;
		overflow: hidden;
		display: inline-block;
		vertical-align: top;
		transition: color 0.8s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.line-hover::after {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 50%;
		width: 100%;
		height: 2px;
		transform: translateX(-100%);
		transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
		transition-delay: 0.1s;
		background: rgba(255, 255, 255, 0.87);
	}

	.line-hover:hover::after {
		transform: translateX(0%);
	}
</style>
