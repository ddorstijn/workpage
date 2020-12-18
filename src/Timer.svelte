<script>
	import {clickOutside} from './click_outside.js';
  import { createPopperActions } from 'svelte-popperjs';

	let running = false;
	let goal = { hours: 1, minutes: 30 };
	let sessions = [{ start: 0, end: 0 }];

	function update() {
		if (!running) return;

		sessions[0].end = Date.now();
		setTimeout(() => {
			update();
		}, 1000);
	};

	function startSession() {
		const now = Date.now();
		running = true;
		sessions[0] = { start: now, end: now };
		update();
	};
	
	function endSession() {
		running = false;
		sessions.unshift({ start: 0, end: 0 });
	};

	function toggleSession() {
		if (running) {
			endSession();
		} else {
			startSession();
		}
	}
	
	function timeToHuman(time) {
		const date = new Date(time);
		const hours = date.getUTCHours();
		const minutes = date.getUTCMinutes();
		const seconds = date.getUTCSeconds();
		return `${hours}h ${minutes}m ${seconds}s`;
	};
	
	$: elapsed = sessions.reduce((accumulator, session) => {
		return accumulator + session.end - session.start;
	}, 0);
	
	$: goalTime = goal.hours * 360000 + goal.minutes * 60000;
	$: progress = Math.min(100, (100 * elapsed) / goalTime);

  const [ popperRef, popperContent ] = createPopperActions();
  const popperOptions = {
		placement: "top",
    modifiers: [
      { name: 'offset', options: { offset: [0, 8] } }
    ],
  };

  let showTooltip = false;
</script>

<style>
	article {
		display: grid;
		gap: var(--space-4) var(--space-1);
		grid-template-rows: 1fr min-content;
		grid-template-columns: min-content 2fr 1fr;
		justify-content: end;
	}

	header {
		width: var(--size-5xl);
		margin-right: var(--space-4);
		align-self: center;
		grid-row: span 2;
	}

	header > button {
		padding: var(--space-1);
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}
	
	.inline-icon {
		height: 1em;
	}
	
	article > svg {
		width: 100%;
		height: 2px;
	}

	article > svg {
		grid-column: span 2;
	}

	.background {
		stroke: var(--tone-200);
	}

	.foreground {
		stroke: var(--tone-900);
	}

	.info > h2 {
		font-size: var(--size-2xl);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	form > h4 {
		text-align: center;
		font-weight: bold;
		margin-bottom: var(--space-1);
	}

	form input {
		width: 5ch;
		text-align: center;
	}

	#reference {
		white-space: nowrap;
		align-self: end;
		justify-self: end;
	}

	.tooltip {
		background: var(--tone-200);
		color: var(--tone-800);
		padding: var(--space-2);
		border-radius: var(--rounded);
		box-shadow: var(--shadow-lg);
	}

	[data-popper-arrow]::before {
		background-color: var(--tone-200);
	}
</style>

<article>
	<header>
		<button on:click={toggleSession}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
			</svg>
		</button>
	</header>
	<section class="info">
		<h2>
			{timeToHuman(elapsed)}
		</h2>
		<h3>
			session:
			<span>{timeToHuman(sessions[0].end - sessions[0].start)}</span>
		</h3>
	</section>

	<button id="reference" use:popperRef on:click="{() => showTooltip = true}">
		<h5>
			{`${goal.hours}h ${goal.minutes}m`}
			<svg class="inline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd" />
			</svg>
		</h5>
	</button>
	{#if showTooltip}
	<div class="tooltip" use:popperContent={popperOptions} use:clickOutside on:click_outside="{() => showTooltip = false}">
		<form>
			<h4>Set goal</h4>
			<label>
				Hours:
				<input bind:value={goal.hours} type="number" size="2" min="0" max="24" required />
			</label>
			<label>
				Minutes:
				<input bind:value={goal.minutes} type="number" size="2" min="0" max="60" required />
			</label>
		</form>
		<div data-popper-arrow />
	</div>
	{/if}
	<svg viewBox="-1 0 102 2" preserveAspectRatio="none">
		<line
					class="background"
					x1="0"
					y1="1"
					x2="100"
					y2="1"
					stroke-width="2"
					stroke-linecap="round"
					/>
		<line
					class="foreground"
					x1="0"
					y1="1"
					x2={progress}
					y2="1"
					stroke-width="2"
					stroke-linecap="round"
					/>
	</svg>
</article>
