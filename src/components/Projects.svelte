<script>
	import { currentId, activeId, projects } from "../store.js";

	// -- Members -- \\
	let editing = null;

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
	<header class="mb-2 pb-1 flex items-baseline justify-center gap-2 border-b">
		<h1>Active id: {getProjectFromId($activeId).title}</h1>
		<button on:click={addGroup}>Add project group</button>
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
						<button on:click={removeItem(group, item)}>Remove item</button>
						<button on:click={editItem(item)}>Edit item</button>
					</li>
				{/each}
			</ul>
		</ul>
	{/each}
</article>
