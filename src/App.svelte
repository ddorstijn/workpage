<script>
	import { loaded } from "./store.js";
</script>

{#await loaded() }
	Loading...
{:then}
	<main>
		{#await import("./components/Clock.svelte") then c}
			<svelte:component this={c.default} />
		{/await}
		{#await import("./components/Projects.svelte") then c} 
			<svelte:component this={c.default} />
		{/await}
		{#await import("./components/Links.svelte") then c}
			<svelte:component this={c.default} />
		{/await}
	</main>
	<aside>
		{#await import("./components/Tasks.svelte") then c}
			<svelte:component this={c.default} />
		{/await}
	</aside>
{/await}

<style>
	main {
		flex: 1;
		display: inline-flex; 
		flex-direction:column; 
		justify-content: center;
		align-items: center; 
		gap: var(--space-6);
	}

	aside {
		padding-left: var(--space-16);
		border-left: 1px solid rgba(255,255,255,0.1);
	}
</style>