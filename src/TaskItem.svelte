<script>
	import { createPopperActions } from 'svelte-popperjs';
	import { clickOutside } from './click_outside.js';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { timerRunning } from './store.js';

	export let item;
	export let disable= false;

	let sessions = [{ start: 0, end: 0, start: 0, end: item.spent }];
	let editing = false;
	let showTooltip = false;

	function startEdit() {
		showTooltip = false;
		editing = true; 
	}

	function removeTask() {
		showTooltip = false;
		dispatch('remove');
	}

	function resize(evt) {
		evt.target.style.height = 'auto';
		evt.target.style.height = `${evt.target.scrollHeight}px`
	};

	function handleInput(evt) {
		if (evt.key === 'Enter' || evt.key === 'Escape') {
			evt.preventDefault();
			evt.target.blur();
		}
	}

	timerRunning.subscribe(val => {
		if (!item.doing) return;
		if (val) {
			startSession();			
			return;
		}
		
		endSession();
	});

	function update() {
		if (!$timerRunning) return;

		sessions[0].end = Date.now();
		setTimeout(() => {
			update();
		}, 5000);
	};

	function startSession() {
		const now = Date.now();
		sessions[0] = { start: now, end: now };
		update();
	};

	function endSession() {
		if (sessions[0] == { start: 0, end: 0}) return;
		sessions.unshift({ start: 0, end: 0 });
	};

	function timeToHuman(time) {
		const date = new Date(time);
		const hours = date.getUTCHours();
		const minutes = date.getUTCMinutes();
		return `${hours}h ${minutes}m`;
	};

	$: item.spent = sessions.reduce((accumulator, session) => {
		return accumulator + session.end - session.start;
	}, 0);

	const [ popperRef, popperContent ] = createPopperActions();
	const popperOptions = {
		placement: "left",
	};
</script>

<div class="task-wrapper">
	<div class="task-body">
		{#if !editing}
			<p class="task-description">{item.description}</p>
		{:else}
			<textarea
				bind:value="{item.description}"
				rows="1"
				class="task-description"
				on:input="{resize}"
				on:blur="{() => editing = false}"
				on:keydown="{handleInput}"
			/>
		{/if}
		<div class="task-details">
			{#if item.due}
				<div class="flex gap-1 items-center rounded-full px-2 py-1 text-sm bg-gray-100" class:error={new Date() > Date.parse(item.due)}>
					<svg class="h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
							clip-rule="evenodd"
						/>
					</svg>
					<p>{item.due.toLocaleString('en-gb', {month: 'short', day: 'numeric'})}</p>
				</div>
			{/if}

			{#if item.estimate}
				<svg class="h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
						clip-rule="evenodd"
					/>
				</svg>
				<p><span>{timeToHuman(item.spent)}</span> / <span>{timeToHuman(item.estimate)}</span></p>
			{/if}
		</div>
	</div>
	{#if !disable}
		<button class="popup-reference" use:popperRef on:click="{() => showTooltip = !showTooltip}">
			<svg class="h-5 text-gray-600 hover:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
				/>
			</svg>
		</button>
		{#if showTooltip}
			<ul class="tooltip" use:popperContent={popperOptions} use:clickOutside on:click_outside="{() => showTooltip = false}">
				<li on:click="{startEdit}">
					<svg class="h-5 hover:text-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
					</svg>
				</li>
				<li on:click="{removeTask}">
					<svg class="h-5 hover:text-red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
				</li>
				<div data-popper-arrow />
			</ul>
		{/if}
	{/if}
</div>

<style lang="postcss">
	.error {
		@apply bg-red;
	}

	.task-wrapper {
		@apply flex justify-between rounded;
	}

	.task-body {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.task-details {
		@apply flex items-center gap-2 text-sm text-gray-400;
	}

	.task-description {
		@apply text-xl;
	}

	.tooltip {
		display: flex;
		align-items: center;

		@apply bg-gray-200 text-gray-800 p-1 rounded shadow-lg;
	}

	.tooltip > li {
		@apply p-2 flex gap-2 rounded;
	}

	.tooltip > li:hover {
		@apply cursor-pointer bg-gray-300;
	}

	[data-popper-arrow]::before {
		@apply bg-gray-200;
	}
</style>
