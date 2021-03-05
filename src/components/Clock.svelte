<script>
	import { onMount } from "svelte";

	// -- Members -- \\
	let date;
	let time;

	// -- Initialization -- \\
	onMount(() => {
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
	<h1>{time}</h1>
	<p>{date}</p>
</article>
