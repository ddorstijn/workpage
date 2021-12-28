<script lang="ts">
  import { editRef, modal, project } from "@/lib/store";
  import * as db from "@/lib/database/LoveFieldModule";
  import type { LinkGroup } from "@/lib/database/types";
  import { _ } from "svelte-i18n";

  let linkgroup: LinkGroup = ($editRef as LinkGroup) ?? { name: "", projectId: $project.id };

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
