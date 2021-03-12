<script lang="ts">
	import { loaded } from "./store.js";
</script>

{#await loaded() }
	Loading...
{:then}
	<main class="w-2/3 flex flex-col items-center justify-center gap-6">
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
	<aside class="w-1/3 pl-16 flex flex-col justify-between gap-12 border-l">
		{#await import("./components/Tasks.svelte") then c}
			<svelte:component this={c.default} />
		{/await}
		{#await import("./components/Timer.svelte") then c}
			<svelte:component this={c.default} />
		{/await}
	</aside>
{/await}

<style lang="postcss">
</style>
