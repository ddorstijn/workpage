<script>
	import { currentId, activeId, projects } from "../store.js";
	import { createPopperActions } from "svelte-popperjs";
	const [projectPopperRef, projectPopperContent] = createPopperActions();
	const [groupPopperRef, groupPopperContent] = createPopperActions();
	const popperOptions = {
		placement: "top",
	};

	// -- Members -- \\
	let editing = null;
	let open = false;
	let creatingProject = false;
	let creatingGroup = false;

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
		if ($projects.length >= 8) return;

		let title = this.querySelector('input[type="text"]').value;

		$projects = [
			...$projects,
			{
				id: $currentId++,
				title,
				items: [],
			},
		];

		this.reset();
		creatingGroup = false;
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

	function addProject() {
		let groupId = Number(this.querySelector("select").value);
		let title = this.querySelector('input[type="text"]').value;
		let group = $projects.find((group) => group.id === groupId);

		group.items.push({
			id: $currentId++,
			title,
		});

		$projects = $projects;
		creatingProject = false;
		this.reset();
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
	<button
		class="mb-6 px-3 py-2 bg-gray-200 flex items-center gap-2 dark:bg-gray-800 rounded shadow"
		on:click={() => (open = true)}
	>
		<span class="material-icons md-18">inventory_2</span>
		{getProjectFromId($activeId).title}
	</button>

	{#if open}
		<div
			class="absolute w-screen h-screen inset-0 flex justify-center items-center z-10"
		>
			<div class="w-1/2 p-8 bg-gray-100 dark:bg-gray-800 rounded">
				<header class="mb-4 flex justify-between">
					<h1 class="text-3xl">Projects</h1>
					<button class="text-gray-400" on:click={() => (open = false)}>
						<span class="material-icons">
							close
						</span>	
					</button>
				</header>
				<div class="p-2 grid grid-cols-3 gap-12">
					{#each $projects as group}
						<ul>
							<header class="mb-2 p-1 group relative border-b dark:border-gray-100">
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
									<span class="text-xl font-bold">{group.title}</span>
								{/if}
								<div class="inline text-sm">
									<button class="opacity-0 group-hover:opacity-100" on:click={removeGroup(group)}>
										<span class="material-icons">
											delete
										</span>
									</button>
									<button class="opacity-0 group-hover:opacity-100" on:click={editGroup(group)}>
										<span class="material-icons">
											edit
										</span>
									</button>
								</div>
							</header>
							<ul class="px-1">
								{#each group.items as item}
									<li class="group" on:click={setActive(item)}>
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
											<span class="text-gray-400">{item.title}</span>
										{/if}
										<button class="material-icons opacity-0 group-hover:opacity-100" on:click={removeItem(group, item)}>
											delete
										</button>
										<button class="material-icons opacity-0 group-hover:opacity-100" on:click={editItem(item)}>
											edit
										</button>
									</li>
								{/each}
							</ul>
						</ul>
					{/each}
				</div>
				<div class="mt-12 flex justify-center divide-x">
					<button
						class="px-4"
						on:click={() => (creatingProject = true)}
						use:projectPopperRef
					>
						Add project
					</button>
					<button
						class="px-4"
						on:click={() => (creatingGroup = true)}
						use:groupPopperRef
					>
						Add group
					</button>
				</div>

				{#if creatingProject}
					<form
						class="tooltip p-6"
						use:projectPopperContent={popperOptions}
						on:submit|preventDefault={addProject}
					>
						<button
							class="float-right text-gray-400"
							type="button"
							on:click={() => (creatingProject = false)}
						>
							close
						</button>

						<label>
							<span class="block">Group</span>
							<select required>
								{#each $projects as project}
									<option value={project.id}>{project.title}</option>
								{/each}
							</select>
						</label>

						<label>
							<span class="block">Title</span>
							<input type="text" placeholder="Name" required />
						</label>

						<input type="submit" value="Add project" />
						<div class="arrow" data-popper-arrow />
					</form>
				{/if}
				{#if creatingGroup}
					<form
						class="tooltip p-6"
						use:groupPopperContent={popperOptions}
						on:submit|preventDefault={addGroup}
					>
						<button
							class="float-right text-gray-400"
							type="button"
							on:click={() => (creatingGroup = false)}
						>
							close
						</button>

						<label class="block mb-2">
							<h3 class="block">Title</h3>
							<input type="text" placeholder="Name" required />
						</label>

						<input type="submit" value="Add group" />
						<div class="arrow" data-popper-arrow />
					</form>
				{/if}
			</div>
		</div>
	{/if}
</article>