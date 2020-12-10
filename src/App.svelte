<script>
	import Clock from './Clock.svelte';
	import Projects from './Projects.svelte';
	import Links from './Links.svelte';
	import Tasks from './Tasks.svelte';
	import Timer from './Timer.svelte';
</script>

<style>
	main {
		width: 67%;
		margin: auto 0;
	}
	
	aside {
		width: 33%;
		padding-left: var(--space-16);

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--spacing-12);

		border-left: var(--space-px) solid var(--tone-300);
	}
</style>

<main>
	<Clock />
	<Projects />
	<Links />
</main>
<aside>
	<Tasks />
	<Timer />
</aside>
