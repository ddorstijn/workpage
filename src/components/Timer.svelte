<script>
	import { activeId } from "../store.js";
	import { onDestroy } from "svelte";

	// -- Helpers -- \\
	let activeProjectId;
	let loaded = false;

	// -- Members -- \\
	let goal = { hours: 1, minutes: 30 };
	let sessions = [{ start: 0, end: 0 }];
	let isRunning = false;
	let editing = false;

	// -- Initialization -- \\
	const unsubscribe = activeId.subscribe((val) => {
		if (isRunning && loaded) {
			endSession();
		}

		let goalId = `goal-${val}`;
		let sessionsId = `sessions-${val}`;
		let isRunningId = `isRunning-${val}`;

		chrome.storage.sync.get(
			[goalId, sessionsId, isRunningId],
			function (result) {
				sessions = result[sessionsId] ?? [{ start: 0, end: 0 }];
				goal = result[goalId] ?? { hours: 1, minutes: 30 };
				isRunning = result[isRunningId] ?? false;

				update();

				syncGoal();
				syncSessions();
				syncRunning();
			}
		);

		activeProjectId = val;
		loaded = true;
	});

	// -- Synchronization -- \\
	async function syncGoal() {
		try {
			chrome.storage.sync.set({ [`goal-${activeProjectId}`]: goal });
			goal = goal;
		} catch (e) {
			console.error(e);
		}
	}

	async function syncSessions() {
		try {
			chrome.storage.sync.set({ [`sessions-${activeProjectId}`]: sessions });
			sessions = sessions;
		} catch (e) {
			console.error(e);
		}
	}

	async function syncRunning() {
		try {
			chrome.storage.sync.set({ [`isRunning-${activeProjectId}`]: isRunning });
			isRunning = isRunning;
		} catch (e) {
			console.error(e);
		}
	}

	// -- Functions -- \\
	async function update() {
		if (!isRunning) return;

		sessions[0].end = Date.now();
		syncSessions();
		setTimeout(() => {
			update();
		}, 1000);
	}

	async function startSession() {
		const now = Date.now();
		isRunning = true;
		sessions[0] = { start: now, end: now };

		syncRunning();
		syncSessions();

		update();
	}

	async function endSession() {
		isRunning = false;
		sessions.unshift({ start: 0, end: 0 });

		syncRunning();
		syncSessions();
	}

	async function toggleSession() {
		if (isRunning) {
			endSession();
		} else {
			startSession();
		}
	}

	async function editGoal() {
		editing = true;
	}

	async function stopEdit() {
		editing = false;
		goal = { hours: this.elements[0].value, minutes: this.elements[1].value };
		syncGoal();
	}

	// -- Human readability -- \\
	function timeToHuman(time) {
		const date = new Date(time);
		const hours = date.getUTCHours();
		const minutes = date.getUTCMinutes();
		const seconds = date.getUTCSeconds();
		return `${hours}h ${minutes}m ${seconds}s`;
	}

	$: elapsed = sessions.reduce((accumulator, session) => {
		return accumulator + session.end - session.start;
	}, 0);

	onDestroy(unsubscribe);
</script>

<article>
	<header class="mb-2 pb-1 flex justify-center gap-2 border-b">
		<button on:click={toggleSession}> Toggle timer </button>
		<button on:click={editGoal}> Edit goal </button>
	</header>
	{#if editing}
		<form on:submit|preventDefault={stopEdit}>
			<input type="number" value={goal.hours} />
			<input type="number" value={goal.minutes} />
			<input type="submit" value="Change" />
		</form>
	{/if}
	<section>
		<h2>{timeToHuman(elapsed)}</h2>
		<h3>
			session: <span>{timeToHuman(sessions[0].end - sessions[0].start)}</span>
		</h3>
	</section>

	<h5>
		goal: {`${goal.hours}h ${goal.minutes}m`}
	</h5>
</article>

<style>
</style>
