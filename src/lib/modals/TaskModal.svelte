<script lang="ts">
  import { modal, project } from "../../store";
  import * as db from "../../database/LoveFieldModule";

  function addTask(e) {
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('input[type="text"]') as HTMLInputElement).value;
    const due = (form.querySelector('input[type="date"]') as HTMLInputElement).valueAsDate;
    const done = false;
    const projectId = $project.id as number;

    db.tasks.add({ name, due, done, projectId });
    $modal = null;
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
