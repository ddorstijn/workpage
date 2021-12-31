<script lang="ts">
  import { db, editRef, modal, project } from "@/lib/store";
  import type { Task } from "@/lib/database/types";
  import { _ } from "svelte-i18n";
  
  import DatePicker from "../DatePicker.svelte";

  let task: Task = ($editRef as Task) ?? { name: "", priority: 0, projectId: null };

  async function setTask(): Promise<void> {
    task.projectId = $project.id;
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
      placeholder={$_("tasks.form.name")}
      bind:value={task.name}
      required
    />

    <div class="row">
      <div class="picker col-7">
        <DatePicker placeholder={$_("tasks.form.due")} bind:date={task.due}  />
      </div>
      <select bind:value={task.priority} class="col-5">
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
    width: 20vw;
  }

  input {
    margin-bottom: 1rem;
  }

  button {
    display: block;
    margin: 1rem auto 0;
  }
</style>
