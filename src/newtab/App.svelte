<script>
	import { loaded } from "../store.js";

	let theme = localStorage.getItem("theme") ?? "light";
	document.querySelector('body').classList.add(theme);

	function toggleTheme() {
		switch (theme) {
			case 'dark':
				document.querySelector('body').classList.replace('dark', 'light');
				theme = 'light';
				break;
		
			case 'light':
				document.querySelector('body').classList.replace('light', 'dark');
				theme = 'dark';
				break;
				
			default:
				break;
		}

		localStorage.setItem("theme", theme);
	}
</script>

<button class="theme-switch material-icons [ md-18 no-gutters hint ]" on:click={toggleTheme}>
	{#if theme == "dark"} light_mode {:else} dark_mode {/if}
</button>
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
	.theme-switch {
		position: absolute;
		left: 0;
		top: 0;
		margin: var(--space-6);
	}

	main {
		flex: 1;
		display: inline-flex; 
		flex-direction:column; 
		justify-content: center;
		align-items: center; 
		gap: var(--space-6);
	}

	aside {
		width: 20vw;
		padding-left: var(--space-8);
		border-left: 1px solid rgb(122,122,122, 0.25);
	}
</style>