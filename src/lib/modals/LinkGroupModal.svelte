<script lang="ts">
  import { modal, project } from "../../store";
  import * as db from "../../database/LoveFieldModule";
  import { db as dbRef } from "../../store";

  function addGroup(e: any): void {
    const form = e.target as HTMLFormElement;
    const name = form.querySelector('input').value;

    db.linkgroups.add($dbRef, { name, projectId: $project.id as number })
    $modal = null;
  }
</script>

<header>Link group</header>
<div>
  <form on:submit|preventDefault={addGroup}>
    <input type="text" required>
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