<script lang="ts">
  import { editRef, modal, project } from "../../store";
  import { onMount } from "svelte";

  import * as db from "../../database/LoveFieldModule";
  import type { Link } from "src/database/database";

  import { _ } from "svelte-i18n";

  let linkGroups = [];
  let link: Link = { name: '', url: '', groupId: linkGroups[0]?.id };

  onMount(async () => {
    linkGroups = await db.linkgroups.get($project);
    link = $editRef as Link ?? link;
    if (!link.groupId) {
      link.groupId = linkGroups[0]?.id;
    }
  });

  function addLink(): void {   
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
  
    if (!link.url.match(regex)) {
      return alert("The url is not valid. Please check it again.");
    } 

    if (link.id) {
      db.links.update(link);
    } else {
      db.links.add(link);
    }

    $editRef = null;
    $modal = null;
  }
</script>

<header>{$_("links.name", {default: "Links"})}</header>
<div>
  <form on:submit|preventDefault={addLink}>
    <input placeholder={$_("links.form.name", {default: "Name"})} bind:value={link.name} required />
    <input placeholder={$_("links.form.url", {default: "Url"})} bind:value={link.url} required />
    <select bind:value={link.groupId} required>
      {#each linkGroups as linkGroup}
        <option value={linkGroup.id}>{linkGroup.name}</option>
      {/each}
    </select>
    <button type="submit">{$_("links.form.save", {default: "Save link"})}</button>
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