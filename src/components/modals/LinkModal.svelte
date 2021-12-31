<script lang="ts">
  import { db, editRef, modal, project } from "@/lib/store";
  import { createEventDispatcher, onMount } from "svelte";

  import type { Link } from "@/lib/database/types";

  import { _ } from "svelte-i18n";

  let linkGroups = [];
  let link: Link = ($editRef as Link) ?? { name: "", url: "" };

  // For the popup
  const dispatch = createEventDispatcher();

  onMount(async () => {
    linkGroups = await db.linkgroups.get($project);
    if (!link.groupId) {
      link.groupId = linkGroups[0]?.id;
    }
  });

  async function addLink(): Promise<void> {
    if (link.id) {
      await db.links.update(link);
    } else {
      await db.links.add(link);
    }

    $editRef = null;
    $modal = null;
    dispatch("close");
  }
</script>

<header>{$_("links.name")}</header>
<div>
  <form on:submit|preventDefault={addLink}>
    <input
      type="text"
      placeholder={$_("links.form.name")}
      bind:value={link.name}
      required
    />
    <input
      type="url"
      placeholder={$_("links.form.url")}
      bind:value={link.url}
      required
    />
    <select bind:value={link.groupId} required>
      {#each linkGroups as linkGroup}
        <option value={linkGroup.id}>{linkGroup.name}</option>
      {/each}
    </select>
    <button type="submit">{$_("links.form.save")}</button>
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
