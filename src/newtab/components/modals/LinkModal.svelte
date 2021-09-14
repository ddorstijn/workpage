<script>
  import { activeModal, activeProject, editRef, dirty } from "../../../store.js";
  import Database from "../../../database.js";
  import { onMount } from "svelte";

  let id = null;
  let name = "";
  let url = "";
  let groupId = null;

  let linkGroups = [];
  function addLink(e) {
    if (id) {
      Database.updateLink(id, name, url, groupId);
    } else {
      Database.addLink(name, url, groupId);
    }    
    
    e.target.reset();
    $dirty = "links";
    $editRef = null;
    $activeModal = null;
  }

  onMount(async () => {
    linkGroups = await Database.getLinkGroups($activeProject);
    groupId = linkGroups[0]?.id;

    if (!$editRef) return;

    id = $editRef;
    const link = await Database.getLink(id);
    name = link[0].name;
    url = link[0].url;
    groupId = link[0].groupId;
  });
</script>

<header>Link</header>
<div>
  <form on:submit|preventDefault={addLink}>
    <input type="text" placeholder="Name" bind:value={name} required>
    <input type="url" placeholder="url" bind:value={url} required>
    <select bind:value={groupId}>
      {#each linkGroups as linkGroup}
        <option value={linkGroup.id}>{linkGroup.name}</option>
      {/each}
    </select>
    <button type="submit">Save link</button>
  </form>
</div>

<style>
  header {
    text-align: center;
    font-weight: bolder;
    margin-bottom: 2rem;
  }

  input {
    margin-bottom: 1rem;
  }

  button {
    display: block;
    margin: 2rem auto 0;
  }
</style>