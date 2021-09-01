<script>
  import { activeModal, activeProject } from "../../../store.js";
  import Database from "../../../database.js";
  import { onMount } from "svelte";

  let name = "";
  let url = "";
  let groupId;

  let linkGroups = [];
  function addLink(e) {
    e.preventDefault();
    Database.addLink(name, url, groupId);
    e.target.reset();
    $activeModal = null;
  }

  onMount(async () => {
    linkGroups = await Database.getLinkGroups($activeProject);
    groupId = linkGroups[0]?.id;
  });
</script>

<header>Create link group</header>
<div>
  <form on:submit={addLink}>
    <input type="text" placeholder="Name" bind:value={name} required>
    <input type="url" placeholder="url" bind:value={url} required>
    <select bind:value={groupId}>
      {#each linkGroups as linkGroup}
        <option value={linkGroup.id}>{linkGroup.name}</option>
      {/each}
    </select>
    <button type="submit">Add link</button>
  </form>
</div>

<style>
  
</style>