<script lang="ts">
  import { editRef, modal, project } from "../../store";
  import * as db from "../../database/LoveFieldModule";
  import type { Task } from "src/database/database";
  import { onMount } from "svelte";

  let dueStr = '';
  let task: Task = { name: '', done: false, projectId: $project.id };

  onMount(() => {
    task = $editRef as Task ?? task;
    // YYYY-MM-DD (Svelte currently does not support binding date input to date)
    dueStr = task.due?.toLocaleString('zu-ZA', {year: "numeric", month:"numeric", day: "numeric"}) ?? dueStr;
  });

  function setTask(): void {
    task.due = dueStr.length ? new Date(dueStr) : null;

    if (task.id) {
      db.tasks.update(task);
    } else {
      db.tasks.add(task);
    }

    $editRef = null;
    $modal = null;
  }
</script>

<header>Task</header>
<div>
  <form on:submit|preventDefault={setTask}>
    <input type="text" bind:value={task.name} required />
    <input type="date" bind:value={dueStr} />
    <button type="submit">Save task</button>
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
