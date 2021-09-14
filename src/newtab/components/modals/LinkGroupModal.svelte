<script>
  import { activeModal, activeProject, editRef, dirty } from "../../../store.js";
  import Database from "../../../database.js";
  import { onMount } from "svelte";

  let id = null;
  let groupName = "";

  function addGroup(e) {
    if (id) {
      Database.updateLinkGroup(id, groupName);
    } else {
      Database.addLinkGroup(groupName, $activeProject);
    }

    e.target.reset();
    $dirty.push("linkgroups");
    $editRef = null;
    $activeModal = null;
  }

  onMount(async () => {
    if (!$editRef) return;

    id = $editRef;
    const linkGroup = await Database.getLinkGroup(id);
    groupName = linkGroup[0].name;
  });
</script>

<header>Link group</header>
<div>
  <form on:submit|preventDefault={addGroup}>
    <input type="text" bind:value={groupName} required>
    <button type="submit">Save group</button>
  </form>
</div>

<style>
  header {
    text-align: center;
    font-weight: bolder;
    margin-bottom: 2rem;
  }

  button {
    display: block;
    margin: 2rem auto 0;
  }
</style>