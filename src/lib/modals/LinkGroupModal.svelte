<script lang="ts">
  import { modal, project } from "../../store";
  import { onMount } from "svelte";
  import Database from "../../database/LoveField";

  let db: Database;

  function addGroup(e) {
    const form = e.target as HTMLFormElement;
    const name = form.querySelector('input').value;

    db.linkgroups.add({ name, projectId: $project.id as number }).then(() => {
      form.reset();
      $modal = null;
    })
  }

  onMount(async () => {
    db = await Database.getInstance();
  });
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