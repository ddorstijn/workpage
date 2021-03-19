<script lang="ts">
	import { loaded } from "./store.js";
</script>

{#await loaded() }
	Loading...
{:then}
	<main class="w-3/4 p-8 flex flex-col items-center justify-center gap-6">
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
	<aside class="w-1/4 p-8 rounded-lg bg-gray-100 shadow-lg">
		{#await import("./components/Tasks.svelte") then c}
			<svelte:component this={c.default} />
		{/await}
	</aside>
{/await}