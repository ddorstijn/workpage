<script>
	import { createEventDispatcher } from 'svelte';
	
	export let title;
	export let items;
	let creating = false;
	let editing = false;

	const dispatch = createEventDispatcher();
	
	function addLink(evt) {
		const formData = new FormData(evt.target);
		const title = formData.get('title');
		const url = formData.get('url');

		items = [...items, {
			title: title,
			url: url,
		}];

		creating = false;
	};
	
	function removeLink(link) {
		let index = indexOf(link);
		items = items.slice(index, index + 1);
	}
</script>

<style>
li {
	width: 25%;
	height: 100%;
}
	
	.list-card {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
}

.list-card > header {
	position: relative;
	padding: 0 var(--space-4);

	display: flex;
	justify-content: space-between;
	align-items: center;

	font-size: var(--size-2xl);
	background: var(--green);
}

.list-card > header > h2 {
	padding: var(--space-2) 0;
}

.list-card > .card-content {
	background: var(--tone-900);
	color: var(--tone-100);
}

.fab {
	position: relative;
	font-size: var(--size-lg);
}

.fab-btn {
	padding: var(--space-2);
	display: flex;
	justify-content: center;
	align-items: center;
}

.fab-btn > svg {
	height: var(--space-4);
	margin: 0 auto;
}

.fab-btn:hover, .fab-btn:focus {
	box-shadow: var(--shadow);
	background: var(--tone-900);
	color: var(--tone-100);
}

.fab-btn + .fab-menu {
	display: flex;
}

.fab-menu {
	position: absolute;
	top: 0;
	right: 100%;
	height: 100%;
	padding: 0 var(--space-1) 0 var(--space-3);

	display: none;
	align-items: center;
	gap: var(--space-2);

	font-size: var(--size-lg);
	background: var(--tone-900);
	color: var(--tone-100);
	border-radius: var(--rounded-full) 0 0 var(--rounded-full);
	box-shadow: var(--shadow);
}

.fab-menu > li:hover {
	cursor: pointer;
	color: var(--tone-500);
}

.fab-menu svg {
	height: 1rem;
}
</style>

<li class="list-card">
	<header>
		<h2>{title}</h2>
		<div class="fab">
			<button class="fab-btn">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /> </svg>
			</button>
			<ul class="fab-menu" dir="RTL">
				<li title="Add link" on:click={() => creating = true}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /> </svg>
				</li>
				<li title="Edit section title" on:click={() => editing = true}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /> </svg>
				</li>
				<li title="Remove section" on:click={() => dispatch('remove')}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /> </svg>
				</li>
			</ul>
		</div>
	</header>
	<div class="card-content">
		{#if creating}
		<section>
			<form on:submit|preventDefault={evt => addLink(evt)}>
				<label>
					Title
					<input type="text" name="title" required />
				</label>
				<label>
					URL
					<input type="url" name="url" required />
				</label>
				<input type="submit" value="Add bookmark" />
			</form>
		</section>
		{/if}
		<div class="draggable">
			{#if !items.length}
			<p>There are no items here yet</p>
			{:else}
			{#each items as link}
			<div>
				<p>{link.title}</p>
				<div class="popup">
					<svg
							 xmlns="http://www.w3.org/2000/svg"
							 fill="none"
							 viewBox="0 0 24 24"
							 stroke="currentColor"
							 height="1em"
							 class="popup-ref"
							 >
						<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
									/>
					</svg>
					<ul class="popup-menu">
						<li on:click={() => editing = true}>
							<svg
									 xmlns="http://www.w3.org/2000/svg"
									 viewBox="0 0 20 20"
									 fill="currentColor"
									 height="1em"
									 >
								<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
							</svg>
						</li>
						<li on:click={evt => removeLink(link)}>
							<svg
									 xmlns="http://www.w3.org/2000/svg"
									 viewBox="0 0 20 20"
									 fill="currentColor"
									 height="1em"
									 >
								<path
											fill-rule="evenodd"
											d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
											clip-rule="evenodd"
											/>
							</svg>
						</li>
					</ul>
				</div>
			</div>
			{/each}
			{/if}
		</div>
	</div>
</li>
