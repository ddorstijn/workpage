<script>
	import { currentId, activeId, projects } from "../store.js";

	// -- Members -- \\
	let editing = null;
	let open = false;

	// -- Initialization -- \\
	projects.subscribe((val) => {
		try {
			chrome.storage.sync.set({ projects: val });
		} catch (e) {
			console.error(e);
		}
	});

	// -- Functions -- \\
	function addGroup() {
		if ($projects.length >= 4) return;

		$projects = [
			...$projects,
			{
				id: $currentId++,
				title: "New group",
				items: [],
			},
		];
	}

	function removeGroup(group) {
		const index = $projects.indexOf(group);
		if (index > -1) {
			$projects.splice(index, 1);
			$projects = $projects;
		}
	}

	function editGroup(group) {
		editing = group.id;
	}

	function addItem(group) {
		group.items.push({
			id: $currentId++,
			title: "New project",
		});

		$projects = $projects;
	}

	function removeItem(group, item) {
		const index = group.items.indexOf(item);
		if (index > -1) {
			group.items.splice(index, 1);
			$projects = $projects;
		}
	}

	function editItem(item) {
		editing = item.id;
	}

	function stopEdit() {
		editing = null;
		$projects = $projects;
	}

	function setActive(item) {
		$activeId = item.id;
	}

	// -- Human readability -- \\
	function getProjectFromId(id) {
		let projectsLength = $projects.length;
		for (let i = 0; i < projectsLength; i++) {
			let project = $projects[i].items.find((p) => p.id == id);
			if (project) {
				return project;
			}
		}
	}
</script>

<article>
	<button class="px-3 py-2 bg-gray-200 flex items-center gap-2 dark:bg-gray-800 text-xl rounded shadow" on:click={() => (open = true)}>
		<svg height="1.1em" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
		</svg>
		{getProjectFromId($activeId).title}
	</button>

	{#if open}
		<div
			class="absolute w-screen h-screen inset-0 flex justify-center items-center"
		>
			<div class="w-1/2 p-8 bg-gray-100 dark:bg-gray-800 rounded">
				<header class="flex justify-between">
					<button on:click={addGroup}>Add project group</button>
					<button on:click={() => (open = false)}>close</button>
				</header>
				{#each $projects as group}
					<ul class="mb-2">
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
								<li on:click={setActive(item)}>
									{#if editing === item.id}
										<form on:submit|preventDefault={stopEdit}>
											<input
												placeholder="Item name"
												bind:value={item.title}
												on:blur={stopEdit}
											/>
											<input type="submit" hidden />
										</form>
									{:else}
										<span>{item.title}</span>
									{/if}
									<button on:click={removeItem(group, item)}>Remove item</button
									>
									<button on:click={editItem(item)}>Edit item</button>
								</li>
							{/each}
						</ul>
					</ul>
				{/each}
			</div>
		</div>
	{/if}
</article>
