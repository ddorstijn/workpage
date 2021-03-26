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
			month: "long",
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

<article>
	<h2 class="emphasis">{time}</h2>
	<p class="subtitle1 hint">{date}</p>
</article>

<style>
	article {
		text-align: center;
	}

	h2 {
		margin-bottom: var(--space-2);
	}
</style>