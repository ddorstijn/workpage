<script lang="ts">
  import { editRef, modal, project } from "../../store";
  import * as db from "../../database/LoveFieldModule";
  import type { Task } from "src/database/database";
  
  import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';

  import { _ } from "svelte-i18n";

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

<header>{$_("tasks.name", {default: "Tasks"})}</header>
<div>
  <form on:submit|preventDefault={setTask}>
    <input placeholder={$_("tasks.form.placeholders.name", {
      default: "Task name",
    })} bind:value={task.name} required />
    <div class="row">
      <Flatpickr class="picker col" placeholder={$_("tasks.form.placeholders.due", {
        default: "Due date",
      })} title="Due date" bind:value={task.due} />
      <select bind:value={task.priority} class="col">
        <option value={0} class="text-grey" selected>
          {$_("tasks.priority.no", { default: "No priority" })}
        </option>
        <option value={1}>
          {$_("tasks.priority.low", { default: "Low priority" })}
        </option>
        <option value={2}>
          {$_("tasks.priority.medium", { default: "Medium priority" })}
        </option>
        <option value={3}>
          {$_("tasks.priority.high", { default: "High priority" })}
        </option>
      </select>
    </div>
    <button type="submit">{$_("tasks.form.save", { default: "Save task" })}</button>
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
