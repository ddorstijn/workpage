<script>
	import { currentId, activeId } from "../store.js";
	import { createPopperActions } from "svelte-popperjs";
	const [linkPopperRef, linkPopperContent] = createPopperActions();
	const [groupPopperRef, groupPopperContent] = createPopperActions();
	const popperOptions = {
		placement: "top",
	};

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
		let title = this.elements[1].value;

		if (links.length >= 4) return;
		links.push({
			id: $currentId++,
			title,
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
		const groupId = Number(this.elements[1].value);
		const title = this.elements[2].value;
		const url = this.elements[3].value;
		const group = links.find((group) => group.id === groupId);

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
	<div class="link-wrapper flex justify-center gap-6">
		{#each links as group}
			<ul class="link-group">
				<header class="mb-1 p-1 group relative border-b dark:border-gray-100">
					<span class="text-xl font-bold">{group.title}</span>
					<button
						class="absolute opacity-0 group-hover:opacity-100"
						on:click={removeGroup(group)}>remove</button
					>
				</header>
				<div class="px-1 dark:text-gray-300">
					{#each group.items as item}
						<div class="group relative">
							<a href={item.url} class="text-sm">{item.title}</a>
							<button
								class="absolute opacity-0 group-hover:opacity-100"
								on:click={removeLink(group, item)}
							>
								remove
							</button>
						</div>
					{/each}
				</div>
			</ul>
		{/each}
	</div>
	<div class="mt-12 flex justify-center divide-x">
		<button
			class="px-4"
			on:click={() => (creatingLink = true)}
			use:linkPopperRef
		>
			Add link
		</button>
		<button
			class="px-4"
			on:click={() => (creatingGroup = true)}
			use:groupPopperRef
		>
			Add group
		</button>
	</div>
	{#if creatingLink}
		<form
			class="tooltip p-6"
			use:linkPopperContent={popperOptions}
			on:submit|preventDefault={addLink}
		>
			<button
				class="float-right text-gray-400"
				type="button"
				on:click={() => (creatingLink = false)}
			>
				close
			</button>

			<label>
				<span class="block">Group</span>
				<select>
					{#each links as link}
						<option value={link.id}>{link.title}</option>
					{/each}
				</select>
			</label>

			<label>
				<span class="block">Title</span>
				<input placeholder="Name" />
			</label>

			<label>
				<span class="block">Url</span>
				<input type="url" placeholder="www.example.com" />
			</label>

			<input type="submit" value="Add link" />
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
				<input placeholder="Name" />
			</label>

			<input type="submit" value="Add group" />
			<div class="arrow" data-popper-arrow />
		</form>
	{/if}
</article>

<style>
	.link-wrapper {
		gap: 6%;
	}

	.link-group {
		width: 20.5%;
	}
</style>
