<script lang="ts">
  import { editRef, modal, project } from "../../store";
  import * as db from "../../database/LoveFieldModule";
  import type { LinkGroup } from "src/database/database";
  import { onMount } from "svelte";

  let linkgroup: LinkGroup = { name: '', projectId: $project?.id }

  onMount(() => {
    linkgroup = $editRef as LinkGroup ?? linkgroup;
  })

  function addGroup(): void {
    if (linkgroup.id) {
      db.linkgroups.update(linkgroup);
    } else {
      db.linkgroups.add(linkgroup);
    }
    
    $editRef = null;
    $modal = null;
  }
</script>

<header>Link group</header>
<div>
  <form on:submit|preventDefault={addGroup}>
    <input type="text" bind:value={linkgroup.name} required placeholder="Group name">
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