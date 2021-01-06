<script>
  import Sortable from "sortablejs";
  import { createEventDispatcher, onMount  } from 'svelte';
  import { createPopperActions } from 'svelte-popperjs';
  import { clickOutside } from './click_outside.js';

  export let title;
  export let items;

  let creating = false;
  let editing = false;
  let showTooltip = false;

  const dispatch = createEventDispatcher();

  function addLink(evt) {
    const formData = new FormData(evt.target);
    const title = formData.get('title');
    const url = formData.get('url');

    items = [...items, {
        title: title,
        url: url,
        showOptions: false,
    }];

    creating = false;
  };

  function removeLink(link) {
    let index = indexOf(link);
    items = items.slice(index, index + 1);
  }

  const [ cardPopperRef, cardPopperContent ] = createPopperActions();
  const [ linkPopperRef, linkPopperContent ] = createPopperActions();

  let listEl;
  onMount(async function() {
    Sortable.create(listEl, {
      group: 'links',
      animation: 100
    });
  });
</script>

<style>
li {
  width: 25%;
  height: 100%;
}

.list-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.list-card > header {
  padding: 0 var(--space-4);

  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: var(--size-2xl);
  background: var(--green);
}

.list-card > header > h2 {
  padding: var(--space-2) 0;
}

.list-card > .card-content {
  background: var(--tone-900);
  color: var(--tone-100);
}

.draggable {
  padding: var(--space-4) var(--space-2);
}

.draggable > * + * {
  margin-top: var(--space-2);
}

#reference {
  height: 100%;
  display: flex;
}

.tooltip {
  background: var(--tone-200);
  color: var(--tone-800);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--rounded);
  box-shadow: var(--shadow-lg);
}

.tooltip > ul {
  display: flex;
  gap: var(--space-3);
}

.tooltip > ul svg {
  height: var(--size-lg); 
}

[data-popper-arrow]::before {
  background-color: var(--tone-200);
}

.link-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#create-link > label {
  display: flex;
  gap: var(--space-2);
}

#create-link input {
  border: 1px solid var(--tone-800);
}
</style>

<li class="list-card">
  <header>
    <h2>{title}</h2>
    <button id="reference" use:cardPopperRef on:click="{() => showTooltip = true}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
    </button>
    {#if showTooltip}
    <div class="tooltip" use:cardPopperContent="{{ placement: 'left' }}" use:clickOutside on:click_outside="{() => showTooltip = false}">
      <ul dir="RTL">
        <li title="Add link" on:click="{() => {creating = true; showTooltip = false}}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> 
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /> 
            </svg>
        </li>
        <li title="Edit section title" on:click="{() => editing = true}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> 
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /> 
          </svg>
        </li>
        <li title="Remove section" on:click="{() => dispatch('remove')}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /> 
          </svg>
        </li>
      </ul>
      <div data-popper-arrow />
    </div>
    {/if}
    {#if creating}
    <div class="tooltip" use:cardPopperContent={{ placement: 'bottom-end' }} use:clickOutside on:click_outside="{() => creating = false}">
      <form on:submit|preventDefault="{evt => addLink(evt)}" id="create-link">
        <label>
          Title
          <input type="text" name="title" required />
        </label>
        <label>
          URL
          <input type="url" name="url" required />
        </label>
        <button type="submit">
          Add bookmark
        </button>
      </form>
      <div data-popper-arrow />
    </div>
    {/if}
  </header>
  <div class="card-content">
    <ul class="draggable" bind:this="{listEl}">
      {#if !items.length}
      <p>There are no items here yet</p>
      {:else}
      {#each items as link}
      <li class="link-item" title="{link.url}">
        <a href="{link.url}">{link.title}</a>
        <button use:linkPopperRef on:click="{() => link.showOptions = true}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        {#if link.showOptions}
        <div class="tooltip" use:linkPopperContent="{{ placement: 'left' }}" use:clickOutside on:click_outside="{() => link.showOptions = false}">
          <ul>
            <li on:click="{() => editing = true}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="1em">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </li>
            <li on:click="{evt => removeLink(link)}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="1em">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </li>
          </ul>
          <div data-popper-arrow />
        </div>
        {/if}
      </li>
      {/each}
      {/if}
    </ul>
  </div>
</li>
