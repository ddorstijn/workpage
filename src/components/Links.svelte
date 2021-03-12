<script>
	import { currentId, activeId } from "../store.js";

	// -- Members -- \\
	let creatingGroup = false;
	let creatingLink = false;
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
		let title = this.elements[0].value;
		let color = this.elements[1].value;
		
		if (links.length >= 4) return;
		links.push({
			id: $currentId++,
			title,
			color,
			items: [],
		});

		syncLinks();
		this.reset();
		creatingGroup = false;
	}

	async function removeGroup(group) {
		const index = links.indexOf(group);
		if (index > -1) {
			links.splice(index, 1);
			syncLinks();
		}
	}

	async function addLink() {
		const groupId = Number(this.elements[0].value);
		const title = this.elements[1].value;
		const url = this.elements[2].value;
		const group = links.find(group => group.id === groupId);

		group.items.push({
			id: $currentId++,
			title,
			url,
		});

		syncLinks();
		this.reset();
		creatingLink = false;
	}

	async function removeLink(group, item) {
		const index = group.items.indexOf(item);
		if (index > -1) {
			group.items.splice(index, 1);
			syncLinks();
		}
	}
</script>

<article class="relative w-full">
	<div class="grid grid-flow-col auto-cols-fr gap-4 justify-center place-items-center">
		{#each links as group}
			<ul>
				<header class="group relative">
					<span class="text-lg">{group.title}</span>
					<button class="absolute opacity-0 group-hover:opacity-100" on:click={removeGroup(group)}>remove</button>
				</header>
				<div>
					{#each group.items as item}
						<div class="group relative">
							<a href={item.url} class="text-sm">{item.title}</a>
							<button class="absolute opacity-0 group-hover:opacity-100" on:click={removeLink(group, item)}>remove</button>
						</div>
					{/each}
				</div>
			</ul>
		{/each}
	</div>
	<div class="mt-12 flex justify-center gap-2">
		<button class="block" on:click={() => creatingLink = true}>Add link</button>
		<button class="block" on:click={() => creatingGroup = true}>Add group</button>
	</div>
{#if creatingLink}
	<div class="absolute inset-0 flex items-center justify-center">
		<form class="bg-gray-200 p-6" on:submit|preventDefault={addLink}>
			<label>
				Group
				<select>
					{#each links as link}
						<option value={link.id}>{ link.title }</option>
					{/each}
				</select>
			</label>
			<label class="block">
				Title
				<input placeholder="Name" />
			</label>

			<label class="block">
				Url
				<input type="url" placeholder="www.example.com" />
			</label>

			<div>
				<button type="button" on:click={() => creatingLink = false}>close</button>
				<input type="submit" value="Add link" />
			</div>
		</form>
	</div>
{/if}
{#if creatingGroup}
	<div class="absolute inset-0 flex items-center justify-center">
		<form class="bg-gray-200 p-6" on:submit|preventDefault={addGroup}>
			<label class="block mb-2">
				<h3 class="block">Title</h3>
				<input placeholder="Name" />
			</label>

			<label class="block mb-2">
				<h3 class="block">Color</h3>
				<input type="color" />
			</label>

			<div class="flex justify-between">
				<button type="button" on:click={() => creatingGroup = false}>close</button>
				<input type="submit" value="Add group" />
			</div>
		</form>
	</div>
{/if}
</article>
