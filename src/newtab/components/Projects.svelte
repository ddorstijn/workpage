<script>
	import { currentId, activeId, projects } from "../../store.js";
	import SortableGroup from "./SortableGroup.svelte";
	import ProjectItem from "./ProjectItem.svelte";

	import { createPopperActions } from "svelte-popperjs";
	const [projectPopperRef, projectPopperContent] = createPopperActions();
	const [groupPopperRef, groupPopperContent] = createPopperActions();
	const popperOptions = {
		placement: "top",
	};

	// -- Members -- \\
	let open = false;
	let creatingProject = false;
	let creatingGroup = false;
	let projectTitle = "";

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

	// -- Human readability -- \\
	$: $projects.forEach(projectGroup => {
		let project = projectGroup.items.find(p => p.id == $activeId);
		if (project) {
			projectTitle = project.title;
		}
	});
</script>

<article>
	<button class="elevation-2" on:click={() => (open = true)}>
		<i class="material-icons">inventory_2</i>
		{projectTitle}
	</button>

	{#if open}
		<div class="scrim">
			<div class="modal [ surface elevation-1 ]">
				<header>
					<h6 class="hint">Projects</h6>
					<button class="material-icons [ hint no-gutters ]" on:click={() => (open = false)}>
						close
					</button>
				</header>
				<div class="modal__body">
					{#each $projects as group}
						<SortableGroup itemComponent={ProjectItem} {group} on:remove={removeGroup(group)} on:sync={() => $projects = $projects} />
					{/each}
				</div>
				<div class="action-buttons">
					<button on:click={() => (creatingProject = true)} use:projectPopperRef>
						Add project
					</button>
					<div class="divider-y"></div>
					<button on:click={() => (creatingGroup = true)} use:groupPopperRef>
						Add group
					</button>
				</div>

				{#if creatingProject}
					<div class="tooltip [ surface elevation-24 ]" use:projectPopperContent={popperOptions}>
						<span class="caption hint">Create project item</span>
						<form on:submit|preventDefault={addProject}>
							<fieldset>
								<label>
									<input type="text" placeholder="Name" required />
									<span>Title</span>
								</label>
								<label>
									<select required>
										<option value="" disabled selected></option>
										{#each $projects as project}
											<option value={project.id}>{project.title}</option>
										{/each}
									</select>
									<span>Group</span>
								</label>
							</fieldset>

							<div class="form-actions">
								<button type="button" on:click={() => (creatingProject = false)} >
									close
								</button>
								<input class="elevation-2" type="submit" value="Add project" />
							</div>
						</form>
						<div class="arrow" data-popper-arrow />
					</div>
				{/if}
				{#if creatingGroup}
					<div class="tooltip [ surface elevation-24 ]" use:groupPopperContent={popperOptions}>
						<span class="caption hint">Create project group</span>
						<form on:submit|preventDefault={addGroup}>
							<label>
								<input type="text" placeholder="Name" required />
								<span>Title</span>
							</label>

							<div class="form-actions">
								<button type="button" on:click={() => (creatingGroup = false)}>
									close
								</button>
								<input class="elevation-2" type="submit" value="Add group" />
							</div>
						</form>
						<div class="arrow" data-popper-arrow />
					</div>
				{/if}
			</div>
		</div>
	{/if}
</article>

<style>
	.scrim {
		position: absolute;
		width: 100vw;
		height: 100vh;
		left: 0;
		top: 0;

		display: flex; 
		justify-content: center;
		align-items: center; 
		z-index: 10;
		background-color: rgba(0,0,0,0.25);
	}

	.modal {
		width: 50vw;
		padding: 2rem; 
		z-index: 20;
	}

	.modal > header {
		margin-bottom: 1rem;

		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.modal__body {
		display: grid; 
		grid-template-columns: 1fr 1fr 1fr;
		gap: 4rem;
	}

	.action-buttons {
		margin-top: var(--space-4);
		display: flex; 
		justify-content: center;
	}
</style>