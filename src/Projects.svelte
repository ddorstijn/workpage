<script>
	import CurrentActive from "./CurrentActive.svelte"; 
	import ProjectCard from "./ProjectCard.svelte";
	import ProjectItem from "./ProjectItem.svelte";
	import { currentID, activeProjectID } from "./store.js";

	let projects = JSON.parse(localStorage.getItem("projects"));
	let activeProject = [];

	if (projects == null) {
		projects = [{
			id: $currentID++,
			title: "Default",
			items: [{
					id: $currentID++,
					title: "Default project",
					showOptions: false,
			}],
		}];

		activeProject = [{
			id: $currentID++,
			refID: projects[0].items[0].id,
			title: "Default project",
			showOptions: false,
		}];
	} else {
		let active = null;
		let projectsLength = projects.length;
		for (let i = 0; i < projectsLength; i++) {
			let pRef = projects[i].items.find(p => p.id == $activeProjectID);
			if (pRef) {
				active = {
					id: $currentID++,
					refID: pRef.id,
					title: pRef.title,
					showOptions: false
				}

				break;
			}
		}

		activeProject = [active];
	}

	$: if (activeProject[0]) $activeProjectID = activeProject[0].refID;
	$: localStorage.setItem("projects", JSON.stringify(projects));

	let show = false;

	function onDropActive(newItems, info) {
		if (info.trigger === "droppedIntoZone") {
			let pRef = newItems.find(x => x.id === info.id);

			activeProject = [{
				refID: pRef.id,
				id: $currentID++,
				title: pRef.title,
				showOptions: false
			}];
		} else {
			activeProject = newItems;
		}
	};

	function addGroup() {
		if (projects.length <= 4) {
			projects = [...projects, {
				id: $currentID++,
				title: "New group",
				items: [],
			}];
		}
	};

	function removeGroup(group) {
		const index = projects.indexOf(group)
		if (index > -1) {
			projects.splice(index, 1);
			projects = projects;
		}
	}
</script>

<article class="projects">
	<button class="banner [ mx-auto mt-4 p-2 pr-4 ] [ bg-gray-900 text-gray-100 ]" on:click="{() => show = true}">
		<svg class="h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
			<path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
			<path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
		</svg>
		<h2 class="text-2xl">{activeProject.length ? activeProject[0].title : 'No active project'}</h2>
	</button>

	{#if show === true}
		<div class="overlay absolute w-screen h-screen inset-0 flex justify-center items-center">
			<div class="modal [ p-8 ]">
				<header class="header [ w-full text-3xl mb-6 ]">
					<h1 class="col-start-2">Projects</h1>
					<button class="justify-self-end text-gray-400 hover:text-gray-600" on:click="{() => show = false}">
						<svg class="h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
							<path fill-rule="evenodd" fill="currentColor" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
						</svg>
					</button>
				</header>
				<div class="mx-auto w-1/2">
					<CurrentActive name="project" items={activeProject} component={ProjectItem} type="projects" onDrop={onDropActive} />
				</div>
				<div class="mt-12 grid grid-cols-2 justify-items-center gap-4">
					{#each projects as group}
						<ProjectCard bind:item={group} on:remove={removeGroup(group)} />
					{/each}
				</div>
				<footer class="mt-12 flex justify-center">
					<button on:click={addGroup}>Add a new group</button>
				</footer>
			</div>
		</div>
	{/if}
</article>

<style lang="postcss">
	.modal {
		@apply bg-gray-100 rounded-xl shadow-xl w-1/2;
	}

	.header {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		justify-items: center;
		align-items: center;
	}
</style>
