<script lang="ts">
  import { modal, project } from "../../store";
  import { onMount } from "svelte";
  import Database from "../../database/LoveField";

  let db: Database;

  onMount(async () => {
    db = await Database.getInstance();
  });

  function addTask(e) {
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('input[type="text"]') as HTMLInputElement).value;
    const due = (form.querySelector('input[type="date"]') as HTMLInputElement).valueAsDate;
    const done = false;
    const projectId = $project.id as number;

    db.tasks.add({ name, due, done, projectId}).then(() => {
      form.reset();
      $modal = null;
    })
  }
</script>

<header>Task</header>
<div>
  <form on:submit|preventDefault={addTask}>
    <input type="text" required />
    <input type="date" />
    <button type="submit">Save task</button>
  </form>
</div>

<style>
  
</style>