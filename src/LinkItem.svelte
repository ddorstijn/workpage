<script>
  import { createEventDispatcher} from 'svelte';
  import { createPopperActions } from 'svelte-popperjs';
  import { clickOutside } from './click_outside.js';

  const dispatch = createEventDispatcher();
  const [ popperRef, popperContent ] = createPopperActions();
  let showOptions = false;

  export let item;
</script>

<div class="link-item" title="{item.url}">
  <a href="{item.url}">{item.title}</a>
  <button use:popperRef on:click="{() => showOptions = true}">
    <svg class="h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  </button>
  {#if showOptions}
    <div class="tooltip" use:popperContent="{{ placement: 'left' }}" use:clickOutside on:click_outside="{() => showOptions = false}">
      <ul>
        <li on:click="{() => dispatch('remove')}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="1em">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </li>
      </ul>
      <div data-popper-arrow />
    </div>
  {/if}
</div>

<style lang="postcss">
  .tooltip {
    @apply bg-gray-200 text-gray-800 py-1 px-2 rounded shadow-lg;
  }

  .tooltip > ul {
    @apply flex gap-3;
  }

  .tooltip > ul svg {
    @apply h-6;
  }

  [data-popper-arrow]::before {
    @apply bg-gray-200;
  }

  .link-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
