<script>
	let show = false;
	let lists = [];
	let currentID = 0;
	let activeProject = [];
	
	function addProject(list, title) {
		list.push({
			id: this.currentID++,
			title: title,
		});
	};
	
	function removeProject(list, project) {
		const index = list.indexOf(project)
		if (index > -1) {
			list.splice(index, 1)
		}
	}
</script>

<style>
article > button {
	padding: var(--space-2);
	padding-right: var(--space-4);
	margin: 0 auto;
	margin-top: var(--space-4);

	display: flex;
	justify-content: center;
	align-items: center;
	gap: var(--space-1);

	background: var(--tone-900);
	color: var(--tone-100);

	border-radius: var(--rounded);
}

article > button > svg {
	height: 1.75rem;
}

article > button > h2 {
	font-size: var(--size-2xl);
}

article > .overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: calc(100% - 2*var(--space-16));
	height: calc(100% - 2*var(--space-16));
	margin: var(--space-16);
	padding: var(--space-8);

	background: var(--tone-100);
	border-radius: var(--rounded-xl);
	box-shadow: var(--shadow-xl);
}

article > .overlay > header {
	margin-bottom: var(--space-6);
	display: flex;
	justify-content: space-between;
	align-items: center;

	font-size: var(--size-3xl);
}

article > .overlay > header > button {
	color: var(--tone-400);
}

article > .overlay > header > button:hover {
	color: var(--tone-600);
}
</style>

<article>
	<button on:click="{() => show = true}">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
			<path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
			<path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
		</svg>
		<h2>{activeProject.length ? activeProject[0].title : 'No active project'}</h2>
	</button>
	{#if show === true}
	<article class="overlay" use:clickOutside on:click_outside="{() => show= false}" >
		<header>
			<h1>Projects</h1>
			<button on:click="{() => show = false}">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="1em">
					<path fill-rule="evenodd" fill="currentColor" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
				</svg>
			</button>
		</header>
		<section>
			<header>
				Current active item:
				<ul>
					<template x-for="project in activeProject" :key="project.id">
						{#each activeProject as project}
						<li>{project.title}</li>
						{/each}
					</template>
				</ul>
			</header>
			<div>
				<section>
					{#each lists as list}
					<div>
						<header x-text="list.title"></header>
						<ul>
							{#each list.items as project}
							<li>
								<h4>
									{project.title}
								</h4>
							</li>
							{/each}
						</ul>
					</div>
					{/each}
				</section>
			</div>
		</section>
	</article>
	{/if}
</article>
