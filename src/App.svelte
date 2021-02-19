<script>
	import Clock from './Clock.svelte';
	import Links from './Links.svelte';
	import Projects from './Projects.svelte';
	import Tasks from './Tasks.svelte';
	import Timer from './Timer.svelte';
	import { onMount } from 'svelte';
	import { themes } from './themes.js';

	// Custom themes
	let themeIndex = localStorage.getItem("themeIndex") || 0;

	function nextTheme() {
		themeIndex++;
		if (themeIndex >= themes.length) {
			themeIndex = 0;
		}

		console.log("Next Theme: " + themeIndex);
		localStorage.setItem("themeIndex", themeIndex);
		updateTheme();
	}

	function updateTheme() {
		const root = document.documentElement;
		const theme = themes[themeIndex];

		root.style.setProperty('--red', theme.red);
		root.style.setProperty('--orange', theme.orange);
		root.style.setProperty('--yellow', theme.yellow);
		root.style.setProperty('--green', theme.green);
		root.style.setProperty('--aqua', theme.aqua);
		root.style.setProperty('--blue', theme.blue);
		root.style.setProperty('--purple', theme.purple);
		root.style.setProperty('--gray-50', theme.gray["50"]);
		root.style.setProperty('--gray-100', theme.gray["100"]);
		root.style.setProperty('--gray-200', theme.gray["200"]);
		root.style.setProperty('--gray-300', theme.gray["300"]);
		root.style.setProperty('--gray-400', theme.gray["400"]);
		root.style.setProperty('--gray-500', theme.gray["500"]);
		root.style.setProperty('--gray-600', theme.gray["600"]);
		root.style.setProperty('--gray-700', theme.gray["700"]);
		root.style.setProperty('--gray-800', theme.gray["800"]);
		root.style.setProperty('--gray-900', theme.gray["900"]);
		root.style.setProperty('--gray-950', theme.gray["950"]);
	}

	onMount(() => {
		updateTheme();
	});
</script>

<button title="Switch theme" class="absolute text-gray-100 hover:text-gray-500" on:click="{nextTheme}">
	<svg class="h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
		<path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd" />
	</svg>
</button>
<main class="w-2/3 my-auto">
	<Clock />
	<Projects />
	<Links />
</main>
<aside class="flex flex-col justify-between gap-12">
	<Tasks />
	<Timer />
</aside>

<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	body {
		@apply w-screen h-screen overflow-hidden p-16 flex gap-16 text-gray-900;
		background: radial-gradient(var(--gray-100) 0%, var(--gray-50) 70%);
	}

	aside {
		@apply w-1/3 pl-16 border-l border-gray-300;
	}

	button {
		@apply flex items-center justify-center gap-1 rounded;
	}

	button > svg {
		@apply h-8;
	}

	input {
		@apply block py-1 px-2 bg-gray-200 border border-gray-400 rounded text-base;
	}

	input:focus {
		@apply border-gray-600;
		outline: none;
	}

	textarea {
		resize: none;
		scrollbar-width: none;
		border-radius: 3px;
		padding: 5px;
		@apply bg-gray-200 border border-gray-400;
	}

	[data-popper-placement^='top'] > [data-popper-arrow] {
		bottom:-4px;
	}

	[data-popper-placement^='right'] > [data-popper-arrow] {
		left:-4px;
	}

	[data-popper-placement^='bottom'] > [data-popper-arrow] {
		top:-4px;
	}

	[data-popper-placement^='left'] > [data-popper-arrow] {
		right:-4px;
	}

	[data-popper-arrow],
	[data-popper-arrow]::before {
		position: absolute;
		display: block;
		width: 8px;
		height: 8px;
		z-index: -1;
	}

	[data-popper-arrow]::before {
		content: '';
		transform: rotate(45deg);
	}
</style>

