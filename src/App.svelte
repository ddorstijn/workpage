<script lang="ts">
	import { loaded } from "./store.js";
</script>

{#await loaded() }
	Loading...
{:then}
	<main class="flex flex-col items-center justify-center gap-6">
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
	<aside class="pl-16 border-l border-gray-200 dark:border-gray-700">
		{#await import("./components/Tasks.svelte") then c}
			<svelte:component this={c.default} />
		{/await}
	</aside>
{/await}

<style>
	main {
		width: 72.5%;
	}

	aside {
		width: 27.5%;
	}
</style>