<script>
	import { currentId, activeId } from "../store.js";

	// -- Members -- \\
	let creating = false;
	let todo = [];
	let done = [];

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

		creating = false;
		syncTodo();
	}

	async function markDone(item) {
		const index = todo.indexOf(item);
		if (index > -1) {
			const [item] = todo.splice(index, 1);
			done.push({
				id: item.id,
				title: item.title,
				finished: new Date().toISOString().slice(0, 10),
			});

			syncTodo();
			syncDone();
		}
	}
</script>

<article>
	<header class="mb-2 pb-1 flex justify-center gap-2 border-b">
		<button on:click={() => (creating = true)}>Add todo</button>
	</header>
	{#if creating}
		<form on:submit|preventDefault={addTodo}>
			<input placeholder="Task description" />
			<input type="date" />
			<input type="submit" value="Add" />
		</form>
	{/if}

	<h1>Todo:</h1>
	<ul>
		{#each todo as item}
			<li>
				{item.title}
				{item.due}
				<button on:click={markDone(item)}>Mark done</button>
			</li>
		{/each}
	</ul>

	<h1>Done:</h1>
	<ul>
		{#each done as item}
			<li>
				{item.title}
				{item.finished}
			</li>
		{/each}
	</ul>
</article>
