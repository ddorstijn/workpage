<script>
	import { onMount } from "svelte";
	import { locale } from "svelte-i18n";
	
	// -- Members -- \\
	let date;
	let time;

	let format = `${$locale}-GB`;

	// -- Initialization -- \\
	onMount(async () => {
		update();
	});

	// -- Functions -- \\
	async function update() {
		const d = new Date();
		let temp = new Intl.DateTimeFormat(format, {
			month: "short",
			day: "numeric",
			weekday: "long",
		}).format(d);
		date = temp[0].toUpperCase() + temp.slice(1)

		time = new Intl.DateTimeFormat(format, {
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