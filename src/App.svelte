<script>
	import { loaded } from "./store.js";

	let active = 0;
</script>

<div class="absolute w-full flex items-center justify-center">
	<button class:selected={active == 0} on:click={() => active = 0}>Clock</button>
	<button class:selected={active == 1} on:click={() => active = 1}>Projects</button>
	<button class:selected={active == 2} on:click={() => active = 2}>Links</button>
	<button class:selected={active == 3} on:click={() => active = 3}>Tasks</button>
	<button class:selected={active == 4} on:click={() => active = 4}>Timer</button>
</div>
<main class="w-full h-screen p-16 flex items-center justify-center bg-gray-300">
	{#await loaded() }
		Loading...
	{:then}
		<div hidden={active !== 0}>
			{#await import("./components/Clock.svelte") then c}
				<svelte:component this={c.default} />
			{/await}
		</div>
		<div hidden={active !== 1}>
			{#await import("./components/Projects.svelte") then c}
				<svelte:component this={c.default} />
			{/await}
		</div>
		<div hidden={active !== 2}>
			{#await import("./components/Links.svelte") then c}
				<svelte:component this={c.default} />
			{/await}
		</div>
		<div hidden={active !== 3}>
			{#await import("./components/Tasks.svelte") then c}
				<svelte:component this={c.default} />
			{/await}
		</div>
		<div hidden={active !== 4}>
			{#await import("./components/Timer.svelte") then c}
				<svelte:component this={c.default} />
			{/await}
		</div>
	{/await}
</main>

<style lang="postcss">
.selected {
	@apply bg-gray-400;
}
</style>
