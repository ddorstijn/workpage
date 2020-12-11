<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import Popup from './Popup.svelte';

	export let title;
	export let created;
	export let due;
	export let spent;
	export let estimate;

	let editing = false;

	function startEdit() {
		editing = true; 
	}

	function handleInput(evt) {
		if (evt.key === 'Enter' || evt.key === 'Escape') {
			evt.preventDefault();
			evt.target.blur();
		}
	}
</script>

<style>
	li {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--rounded);
	}

	textarea {
		background: transparent;
		resize: none;
	}

	li > div {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	li > div > div {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	li > div > div > div {
		display: flex;
		align-items: center;
	}

	svg {
		height: 1em;
	}
</style>

<li>
	<div>
		{#if !editing}
		<p>
			{ title }
		</p>
		{:else}
		<textarea
			bind:value="{title}"
			rows="1"
			on:input="{resize}"
			on:blur="{() => editing = false}"
			on:keydown="{handleInput}"
		/>
		{/if}
		<div>
			<div>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
						clip-rule="evenodd"
					/>
				</svg>
				<p>
					{ due.toLocaleString('en-gb', { month: 'short', day: 'numeric' }) }
				</p>
			</div>

			<div>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
						clip-rule="evenodd"
					/>
				</svg>
				<p>{ spent } / { estimate }</p>
			</div>
		</div>
	</div>
	<Popup placement="left">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
			/>
		</svg>
		<ul slot="tooltip">
			<li on:click="{startEdit}">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path
						d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
					/>
				</svg>
			</li>
			<li on:click="{() => dispatch('remove')}">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
						clip-rule="evenodd"
					/>
				</svg>
			</li>
		</ul>
	</Popup>
</li>

