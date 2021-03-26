<script>
	import { activeId } from "../store.js";
	import { onDestroy } from "svelte";

	// -- Helpers -- \\
	let activeProjectId;
	let loaded = false;

	// -- Members -- \\
	let sessions = [{ start: 0, end: 0 }];
	let isRunning = false;

	// -- Initialization -- \\
	const unsubscribe = activeId.subscribe((val) => {
		if (isRunning && loaded) {
			endSession();
		}

		let sessionsId = `sessions-${val}`;
		let isRunningId = `isRunning-${val}`;

		chrome.storage.sync.get(
			[sessionsId, isRunningId],
			function (result) {
				sessions = result[sessionsId] ?? [{ start: 0, end: 0 }];
				isRunning = result[isRunningId] ?? false;

				update();

				syncSessions();
				syncRunning();
			}
		);

		activeProjectId = val;
		loaded = true;
	});

	// -- Synchronization -- \\
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
			return;
		}

		startSession();
	}

	// -- Human readability -- \\
	function timeToHuman(time, showSeconds = true) {
		const date = new Date(time);
		const hours = date.getUTCHours();
		const minutes = date.getUTCMinutes();
		const seconds = date.getUTCSeconds();
		if (showSeconds) {
			return `${hours}h ${minutes}m ${seconds}s`;
		}

		return `${hours}h ${minutes}m`;
	}

	$: elapsed = sessions.reduce((accumulator, session) => {
		return accumulator + session.end - session.start;
	}, 0);

	onDestroy(unsubscribe);
</script>

<article class="flex justify-between">
	<div>
		<h2 class="text-lg">{timeToHuman(sessions[0].end - sessions[0].start)}</h2>
		<h3 class="text-sm">total: {timeToHuman(elapsed, false)}</h3>
	</div>
	<div>
		<button on:click={toggleSession}> 
			{#if isRunning}
				Stop
			{:else}
				Start
			{/if}
		</button>
	</div>
</article>

<style>
</style>
