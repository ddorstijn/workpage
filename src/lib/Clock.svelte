<script>
	import { onMount } from "svelte";

	// -- Members -- \\
	let date;
	let time;

	// -- Initialization -- \\
	onMount(async () => {
		update();
	});

	// -- Functions -- \\
	async function update() {
		const d = new Date();
		date = new Intl.DateTimeFormat("en-GB", {
			month: "short",
			day: "numeric",
			weekday: "long",
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

<article class="text-center">
	<h1 class="text-dark">{time}</h1>
	<p class="text-grey">{date}</p>
</article>

<style>
	h1 {
		margin: 0;
		line-height: 1em;
		font-weight: bold;
		font-size: 6.4rem;
	}
</style>