<script>
	import { createPopper } from '@popperjs/core';
	import { onMount } from 'svelte';

	export let placement;
	let reference;
	let popup;
	let show = false;

	onMount(() => {
		createPopper(reference, popup, {
			placement: placement,
		});
	});
</script>

<style>
	button {
		white-space: nowrap;
		align-self: end;
		justify-self: end;
	}

	.tooltip {
		width: 200px;
		background: var(--tone-900);
		color: var(--tone-100);
		padding: var(--space-2);
		border-radius: var(--rounded);
		box-shadow: var(--shadow-lg);
	}

	.arrow,
	.arrow::before {
		width: 8px;
		height: 8px;
		z-index: -1;
	}

	.arrow::before {
		content: '';
		transform: rotate(45deg);
		background: var(--tone-900);
	}

	.tooltip[data-popper-placement^='top'] > .arrow {
		bottom: -4px;
	}

	.tooltip[data-popper-placement^='bottom'] > .arrow {
		top: -4px;
	}

	.tooltip[data-popper-placement^='left'] > .arrow {
		right: -4px;
	}

	.tooltip[data-popper-placement^='right'] > .arrow {
		left: -4px;
	}
</style>

<button bind:this={reference} on:click="{() => show = !show}">
	<slot></slot>
</button>
<div class="tooltip" bind:this={popup} hidden={!show}>
	<slot name="tooltip"></slot>	
	<div class="arrow" data-popper-arrow></div>
</div>
