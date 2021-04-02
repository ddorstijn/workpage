<script>
	import { currentId, activeId } from "../../store.js";
	import { createPopperActions } from "svelte-popperjs";
	import SortableGroup from "./SortableGroup.svelte";
	import LinkItem from "./LinkItem.svelte";

	// -- Members -- \\
	const [linkPopperRef, linkPopperContent] = createPopperActions();
	const [groupPopperRef, groupPopperContent] = createPopperActions();
	const popperOptions = { placement: "top" };

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
			links = links;
			chrome.storage.sync.set({ [`links-${$activeId}`]: links });
		} catch (e) {
			console.error(e);
		}
	}

	// -- Functions -- \\
	async function addGroup() {
		let title = this.querySelector("input").value;

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
      group = group;
		}
	}

	async function addLink() {
		const groupId = Number(this.querySelector("select").value);
		const title = this.querySelector('input[type="text"]').value;
		const url = this.querySelector('input[type="url"]').value;
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
</script>

<article>
	<div class="link-wrapper">
		{#each links as group}
			<SortableGroup itemComponent={LinkItem} {group} on:remove={removeGroup(group)} on:sync={syncLinks} />
		{/each}
	</div>
	<div class="action-buttons">
		<button
			class="hint"
			on:click={() => (creatingLink = true)}
			use:linkPopperRef
		>
			Add link
		</button>
		<div class="divider-y" />
		<button
			class="hint"
			on:click={() => (creatingGroup = true)}
			use:groupPopperRef
		>
			Add group
		</button>
	</div>
	{#if creatingLink}
		<div
			class="tooltip [ surface elevation-24 ]"
			use:linkPopperContent={popperOptions}
		>
			<span class="caption hint">Create link item</span>
			<form on:submit|preventDefault={addLink}>
				<fieldset>
					<label>
						<input type="text" placeholder="Name" required />
						<span>Title</span>
					</label>

					<label>
						<select required>
							<option value="" disabled selected></option>
							{#each links as link}
								<option value={link.id}>{link.title}</option>
							{/each}
						</select>
						<span>Group</span>
					</label>
				</fieldset>

				<label>
					<input type="url" placeholder="www.example.com" required />
					<span>Url</span>
				</label>

				<div class="form-actions">
					<button type="button" on:click={() => (creatingLink = false)}>
						close
					</button>
					<input class="elevation-2" type="submit" value="Add link" />
				</div>
			</form>
			<div class="arrow" data-popper-arrow />
		</div>
	{/if}
	{#if creatingGroup}
		<div
			class="tooltip [ surface elevation-24 ]"
			use:groupPopperContent={popperOptions}
		>
			<span class="caption hint">Create link group</span>
			<form on:submit|preventDefault={addGroup}>
				<label>
					<input type="text" placeholder="Name" />
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
</article>

<style>
	article {
		width: 100%;
		margin-top: var(--space-8);
	}

	.link-wrapper {
		width: 100%;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(auto, 15rem);
		justify-content: center;
		justify-items: center;
		gap: var(--space-8);
	}

	.action-buttons {
		margin-top: var(--space-12);
		display: flex;
		justify-content: center;
	}
</style>
