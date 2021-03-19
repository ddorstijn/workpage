<script>
	import { currentId, activeId } from "../store.js";

	import { dndzone } from "svelte-dnd-action";
	import { createPopperActions } from "svelte-popperjs";
	const [popperRef, popperContent] = createPopperActions();
	const popperOptions = {
		placement: "bottom-start",
		modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
	};

	// -- Members -- \\
	let showTooltip = false;
	let viewDone = false;
	let todo = [];
	let done = [];
	let dragDisabled = true;

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
		todo.push({
			id: $currentId++,
			title: this.elements[0].value,
			due: this.elements[1].value,
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
		if (e.info.source === SOURCES.POINTER) {
			dragDisabled = true;
		}
	}

	function startDrag(e) {
		// preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
		e.preventDefault();
		dragDisabled = false;
	}
</script>

<article class="h-full flex flex-col justify-between">
	<header class="mb-4">
		<form
			class="flex items-center divide-x rounded overflow-hidden shadow bg-white"
			on:submit|preventDefault={addTodo}
		>
			<svg
				class="px-2 text-blue-400"
				height="1em"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
				<path
					fill-rule="evenodd"
					d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
					clip-rule="evenodd"
				/>
			</svg>
			<input
				class="px-2 py-1 flex-1"
				placeholder="Write a new task..."
				required
			/>
			<input type="submit" hidden />
			<button
				class="py-1 px-2 self-stretch"
				type="button"
				title="Add due date"
				use:popperRef
				on:click={() => (showTooltip = !showTooltip)}
			>
				<svg
					height="1em"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</button>
		</form>
		{#if showTooltip}
			<div class="tooltip" use:popperContent={popperOptions}>
				<input type="date" />
				<div class="arrow" data-popper-arrow />
			</div>
		{/if}
	</header>
	<div class="min-h-0 flex-1 flex-grow overflow-auto">
		<ul
			use:dndzone={{ items: todo, dragDisabled, dropTargetStyle: {} }}
			on:consider={handleDndConsider}
			on:finalize={handleDndFinalize}
		>
			{#each todo as item (item.id)}
				<li
					class="my-2 pl-4 p-2 flex justify-between items-center bg-white rounded"
				>
					<div>
						<h2 class="my-1 font-bold">{item.title}</h2>
						{#if item.due}
							<span class="flex items-center gap-1 text-xs text-gray-400">
								<svg
									class="text-gray-400 h-3"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
										clip-rule="evenodd"
									/>
								</svg>
								{item.due}
							</span>
						{/if}
					</div>
					<div
						aria-label="drag-handle"
						class="handle"
						style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
						on:mousedown={startDrag}
						on:touchstart={startDrag}
					>
						<svg
							class="h-6 text-gray-200"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 9l4-4 4 4m0 6l-4 4-4-4"
							/>
						</svg>
					</div>
				</li>
			{/each}
		</ul>
	</div>
	<div class="flex justify-center gap-2">
		<button on:click={() => (viewDone = !viewDone)}>View history</button>
	</div>
</article>