<script lang="ts">
  import { db, editRef, modal, project } from "@/lib/store";
  import type { LinkGroup } from "@/lib/database/types";
  import { _ } from "svelte-i18n";

  let linkgroup: LinkGroup = ($editRef as LinkGroup) ?? { name: "", projectId: $project.id };

  async function addGroup(): Promise<void> {
    if (linkgroup.id) {
      await db.linkgroups.update(linkgroup);
    } else {
      await db.linkgroups.add(linkgroup);
    }

    $editRef = null;
    $modal = null;
  }
</script>

<header>{$_("linkgroups.name")}</header>
<div>
  <form on:submit|preventDefault={addGroup}>
    <input
      placeholder={$_("linkgroups.form.name")}
      bind:value={linkgroup.name}
      required
    />
    <button type="submit">{$_("linkgroups.form.save")}</button>
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
