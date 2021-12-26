<script lang="ts">
  import { editRef, modal, project } from "../../store";
  import { onMount } from "svelte";

  import * as db from "../../database/LoveFieldModule";
  import type { Link } from "src/database/database";

  let linkGroups = [];
  let link: Link = { name: '', url: '', groupId: linkGroups[0]?.id }

  onMount(async () => {
    linkGroups = await db.linkgroups.get($project);
    link = $editRef as Link ?? link;
    if (!link.groupId) {
      link.groupId = linkGroups[0]?.id;
    }
  });

  function addLink(): void {   
    if (link.id) {
      db.links.update(link);
    } else {
      db.links.add(link);
    }

    $editRef = null;
    $modal = null;
  }
</script>

<header>Link</header>
<div>
  <form on:submit|preventDefault={addLink}>
    <input type="text" placeholder="Name" bind:value={link.name} required>
    <input type="url" placeholder="Url" bind:value={link.url} required>
    <select bind:value={link.groupId} required>
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