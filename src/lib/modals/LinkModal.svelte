<script lang="ts">
  import { modal, project } from "../../store";
  import { onMount } from "svelte";

  import * as db from "../../database/LoveFieldModule";
  import { db as dbRef } from "../../store";

  let linkGroups = [];

  onMount(async () => {
    linkGroups = await db.linkgroups.get($dbRef, $project.id as number);
  });

  function addLink(e: any): void {
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('input[type="text"]') as HTMLInputElement).value;
    const url = (form.querySelector('input[type="url"]') as HTMLInputElement).value;
    const groupId = (form.querySelector('select') as HTMLSelectElement).value;
    
    db.links.add($dbRef,{name, url, groupId});
    $modal = null;
  }
</script>

<header>Link</header>
<div>
  <form on:submit|preventDefault={addLink}>
    <input type="text" placeholder="Name" required>
    <input type="url" placeholder="Url" required>
    <select>
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