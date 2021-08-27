<script>
  import { loaded, activeProject } from "../store";
  import { onMount } from 'svelte';

	let theme = localStorage.getItem("theme") ?? "light";
  let links;

  let title = "";
  let url = "";
  let groupId;

	onMount(async () => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      title = tabs[0].title;
      url = tabs[0].url;
    });
  });

	document.querySelector('body').classList += theme;

	activeId.subscribe(val => {
		chrome.storage.sync.get([`links-${val}`], function (result) {
			links = result[`links-${val}`] ?? [];
			syncLinks();
		});
	});

	async function addLink() {
    this.reset();
	}

</script>

{#await loaded() }
	Loading...
{:then}
  <span class="project-title">Current project: { activeProject }</span>
  <form on:submit|preventDefault={addLink}>
    <fieldset>
      <label>
        <input type="text" placeholder="Name" bind:value={title} required />
        <span>Title</span>
      </label>

      <label>
        <select bind:value={groupId} required>
          <option value="" disabled selected></option>
          {#each links as link}
            <option value={link.id}>{link.title}</option>
          {/each}
        </select>
        <span>Group</span>
      </label>
    </fieldset>

    <label>
      <input type="url" placeholder="" bind:value={url} required />
      <span>Url</span>
    </label>

    <input class="elevation-2" type="submit" value="Add link" />
  </form>
{/await}

<style>
  .project-title {
    display: block;
    text-align: center;
    margin-bottom: var(--space-2);
  }

  input[type="submit"] {
    margin-left: auto;
    margin-top: var(--space-2);
  }
</style>