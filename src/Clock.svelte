<script>
	import { onMount } from 'svelte';

	let date = "date";
	let time = "time";
		
	function update() {
		const d = new Date()
		date = new Intl.DateTimeFormat('en-GB', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		}).format(d)
		
		time = new Intl.DateTimeFormat('en-GB',  {
			hour: 'numeric',
			minute: 'numeric',
		}).format(d)

		setTimeout(() => {
			update()
		}, 5000);
	};
	
	onMount(() => {
		update();
	});
</script>

<style>
article {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

h1 {
	font-size: var(--size-7xl);	
}

p {
	font-size: var(--size-2xl);
}
</style>

<article>
	<h1>{time}</h1>
	<p>{date}</p>
</article>
