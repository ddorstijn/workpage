<script lang="ts">
  import { editRef, modal, project } from "../../store";
  import * as db from "../../database/LoveFieldModule";
  import type { Task } from "src/database/database";
  
  import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';

  let task: Task = $editRef as Task ?? { name: '', projectId: $project.id };

  function setTask(): void {
    if (!task.due) {
      task.due = null;
    }

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
    <input placeholder="Task name" bind:value={task.name} required />
    <div class="row">
      <Flatpickr class="picker col" placeholder="Due date" title="Due date" bind:value={task.due} />
      <select bind:value={task.priority} class="col">
        <option value={0}>No priority</option>
        <option value={1}>Low priority</option>
        <option value={2}>Medium priority</option>
        <option value={3}>High priority</option>
      </select>
    </div>
    <button type="submit">Save task</button>
  </form>
</div>

<style>
  header {
    text-align: center;
    font-weight: bolder;
    margin-bottom: 2rem;
  }

  form {
    width: 15vw;
  }

  input {
    margin-bottom: 1rem;
  }

  button {
    display: block;
    margin: 1rem auto 0;
  }
</style>
