<script>
	import Popup from './Popup.svelte'

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
</script>

<style>
	/* Timer */
	article {
		display: grid;
		gap: var(--space-4) var(--space-1);
		grid-template-rows: 1fr min-content;
		grid-template-columns: min-content 2fr 1fr;
	}

	header {
		width: var(--size-5xl);
		grid-row: span 2;
	}

	button {
		padding: var(--space-1);
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}
	
	button > svg {
		height: var(--size-lg);
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
</style>

<article>
	<header>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
			<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
		</svg>
	</header>
	<section id="timer-info">
		<h2>
			{timeToHuman(elapsed)}
		</h2>
		<h3>
			session:
			<span>{timeToHuman(sessions[0].end - sessions[0].start)}</span>
		</h3>
	</section>
	<section class="actions">
		{#if !running}
		<button on:click={startSession}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
			</svg>
			Start
		</button>
		{:else}
		<button on:click={endSession}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd" />
			</svg>
			Stop
		</button>
		{/if}
		<!-- Popup -->
		<Popup>
			<span>
				goal:
				<h5>
					{`${goal.hours}h ${goal.minutes}m`}
				</h5>
			</span>
			<form slot="tooltip">
				<label>
					Hours:
					<input bind:value={goal.hours} type="number" size="2" />
				</label>
				<label>
					Minutes:
					<input bind:value={goal.minutes} type="number" size="2" />
				</label>
			</form>
		</Popup>
	</section>
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
