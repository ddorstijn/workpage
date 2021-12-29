<script lang="ts">
  import { db, editRef, modal, project } from "@/lib/store";
  import type { Task } from "@/lib/database/types";

  import Flatpickr from "svelte-flatpickr";
  import "flatpickr/dist/flatpickr.css";

  import { _ } from "svelte-i18n";

  let task: Task = ($editRef as Task) ?? { name: "", projectId: $project.id };

  async function setTask(): Promise<void> {
    if (!task.due) {
      task.due = null;
    }

    if (task.id) {
      await db.tasks.update(task);
    } else {
      await db.tasks.add(task);
    }

    $editRef = null;
    $modal = null;
  }
</script>

<header>{$_("tasks.name")}</header>
<div>
  <form on:submit|preventDefault={setTask}>
    <input
      placeholder={$_("tasks.form.placeholders.name")}
      bind:value={task.name}
      required
    />

    <div class="row">
      <Flatpickr
        class="picker col"
        placeholder={$_("tasks.form.placeholders.due")}
        title="Due date"
        bind:value={task.due}
      />
      <select bind:value={task.priority} class="col">
        <option value={0} class="text-grey">
          {$_("tasks.priority.no")}
        </option>
        <option value={1}>
          {$_("tasks.priority.low")}
        </option>
        <option value={2}>
          {$_("tasks.priority.medium")}
        </option>
        <option value={3}>
          {$_("tasks.priority.high")}
        </option>
      </select>
    </div>

    <button type="submit">{$_("tasks.form.save")}</button>
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
