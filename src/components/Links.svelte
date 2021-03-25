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
		let title = this.querySelector('input').value;

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
		const groupId = Number(this.querySelector('select').value);
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

	async function removeLink(group, item) {
		const index = group.items.indexOf(item);
		if (index > -1) {
			group.items.splice(index, 1);
			syncLinks();
		}
	}
</script>

<article>
	<div class="link-wrapper ">
		{#each links as group}
			<div class="link-group">
				<header>
					<h5 class="emphasis">{group.title}</h5>
					<!-- <button class="no-gutters hint" on:click={removeGroup(group)}>
						remove
					</button> -->
				</header>
				<div>
					{#each group.items as item}
						<div class="link-item">
							<a href={item.url}>{item.title}</a>
							<button class="material-icons md-18 no-gutters hint" on:click={removeLink(group, item)}>
								delete
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<div class="action-buttons">
		<button on:click={() => (creatingLink = true)} use:linkPopperRef>
			Add link
		</button>
		<div class="divider-y"></div>
		<button on:click={() => (creatingGroup = true)} use:groupPopperRef>
			Add group
		</button>
	</div>
	{#if creatingLink}
		<div class="tooltip [ surface elevation-24 ]" use:linkPopperContent={popperOptions}>
			<span class="caption hint">Create link item</span>
			<form on:submit|preventDefault={addLink}>
				<select required>
					<option value="" disabled selected>Choose group</option>
					{#each links as link}
						<option value={link.id}>{link.title}</option>
					{/each}
				</select>

				<label>
					<input type="text" placeholder="Name" required />
					<span>Title</span>
				</label>

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
		<div class="tooltip [ surface elevation-24 ]" use:groupPopperContent={popperOptions}>
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
		display: flex;
		justify-content: center;
		gap: 12%;
	}

	.link-group {
		width: 16%;
	}

	.link-group > header {
		position: relative;
		margin-bottom: var(--space-1);
		padding: var(--space-1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.87);
	}

	.action-buttons {
		margin-top: var(--space-8);
		display: flex; 
		justify-content: center;
	}

	.link-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--space-1)
	}

	.link-item > a {
		text-decoration: none;
		color: inherit;
	}
</style>
