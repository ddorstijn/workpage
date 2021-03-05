<script>
	import { currentId, activeId } from "../store.js";

	// -- Members -- \\
	let editing = null;
	let links = [];

	// -- Initialization -- \\
	activeId.subscribe((val) => {
		chrome.storage.sync.get([`links-${val}`], function (result) {
			links = result[`links-${val}`] ?? [];
			syncLinks();
		});
	});

	// -- Synchronization \\
	async function syncLinks() {
		try {
			chrome.storage.sync.set({ [`links-${$activeId}`]: links });
			links = links;
		} catch (e) {
			console.error(e);
		}
	}

	// -- Functions -- \\
	async function addGroup() {
		if (links.length >= 4) return;
		links.push({
			id: $currentId++,
			title: "New group",
			items: [],
		});

		syncLinks();
	}

	async function removeGroup(group) {
		const index = links.indexOf(group);
		if (index > -1) {
			links.splice(index, 1);
			syncLinks();
		}
	}

	async function editGroup(group) {
		editing = group.id;
	}

	async function addItem(group) {
		group.items.push({
			id: $currentId++,
			title: "New link",
			url: "https://www.google.com",
		});

		syncLinks();
	}

	async function removeItem(group, item) {
		const index = group.items.indexOf(item);
		if (index > -1) {
			group.items.splice(index, 1);
			syncLinks();
		}
	}

	async function editItem(item) {
		editing = item.id;
	}

	async function stopEdit() {
		editing = null;
		syncLinks();
	}
</script>

<article>
	<header class="mb-2 pb-1 flex justify-center gap-2 border-b">
		<button on:click={addGroup}>Add link group</button>
	</header>
	{#each links as group}
		<ul>
			<header>
				{#if editing === group.id}
					<form on:submit|preventDefault={stopEdit}>
						<input
							placeholder="Group name"
							bind:value={group.title}
							on:blur={stopEdit}
						/>
						<input type="submit" hidden />
					</form>
				{:else}
					<span>{group.title}</span>
				{/if}
				<button on:click={addItem(group)}>Add item</button>
				<button on:click={removeGroup(group)}>Remove group</button>
				<button on:click={editGroup(group)}>Edit group</button>
			</header>
			<ul class="ml-4">
				{#each group.items as item}
					<li>
						{#if editing === item.id}
							<form on:submit|preventDefault={stopEdit}>
								<input placeholder="Item name" bind:value={item.title} />
								<input placeholder="Item url" bind:value={item.url} />
								<input type="submit" hidden />
							</form>
						{:else}
							<a href={item.url}>{item.title}</a>
						{/if}
						<button on:click={removeItem(group, item)}>Remove item</button>
						<button on:click={editItem(item)}>Edit item</button>
					</li>
				{/each}
			</ul>
		</ul>
	{/each}
</article>
