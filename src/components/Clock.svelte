<script lang="ts">
	import { onMount } from "svelte";

	// -- Members -- \\
	let date: string;
	let time: string;

	// -- Initialization -- \\
	onMount(async () => {
		update();
	});

	// -- Functions -- \\
	async function update() {
		const d = new Date();
		date = new Intl.DateTimeFormat("en-GB", {
			year: "numeric",
			month: "short",
			day: "numeric",
			weekday: "short",
		}).format(d);

		time = new Intl.DateTimeFormat("en-GB", {
			hour: "numeric",
			minute: "numeric",
		}).format(d);

		setTimeout(() => {
			update();
		}, 5000);
	}
</script>

<article>
	<h1 class="mb-2 text-6xl text-center">{time}</h1>
	<p class="text-center">{date}</p>
</article>
