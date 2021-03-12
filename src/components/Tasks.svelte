<script>
	import { currentId, activeId } from "../store.js";

	// -- Members -- \\
	let viewDone = false;
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
			done.unshift({
				id: item.id,
				title: item.title,
				finished: new Date().toISOString().slice(0, 10),
			});

			syncTodo();
			syncDone();
		}
	}
</script>

<article class="relative">
{#if viewDone}
	<ul>
		{#each done.slice(0, 5) as item}
			<li>
				<h3 class="block line-through">{item.title}</h3>
				<p class="text-xs text-gray-500 text-left">Finished: {item.finished}</p>
			</li>
		{/each}
	</ul>
{:else}
	<ul>
		{#each todo as item}
			<li>
				<button class="group" on:click={markDone(item)}>
					<h3 class="block text-lg group-hover:line-through">{item.title}</h3>
					<p class="text-xs text-gray-500 text-left">{item.due}</p>
				</button>
			</li>
		{/each}
	</ul>
{/if}
{#if creating}
	<div class="absolute inset-0 mt-2 flex items-center justify-center">
		<form class="bg-gray-200 p-6" on:submit|preventDefault={addTodo}>
			<label class="block mb-2">
				<h3 class="block">Description</h3>
				<input placeholder="Task description" required />
			</label>

			<label class="block mb-2">
				<h3 class="block">Due date</h3>
				<input type="date" />
			</label>

			<div class="flex justify-between">
				<button type="button" on:click={() => creating = false}>cancel</button>
				<input type="submit" value="Add todo" />
			</div>
		</form>
	</div>
{/if}
<div class="flex justify-center gap-2">
	<button on:click={() => (viewDone = !viewDone)}>Toggle view</button>
	<button on:click={() => (creating = true)}>Add todo</button>
</div>
</article>
