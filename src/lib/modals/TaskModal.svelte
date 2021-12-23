<script lang="ts">
  import { editRef, modal } from "../../store";
  import * as db from "../../database/LoveFieldModule";
  import type { Task } from "src/database/database";

  const { id, name, due, projectId } = $editRef as Task || {};

  function setTask() {
    if (id) {
      db.tasks.update({ id, name, due, done: false, projectId });
    } else {
      db.tasks.add({ name, due, done: false, projectId });
    }

    $editRef = null;
    $modal = null;
  }
</script>

<header>Task</header>
<div>
  <form on:submit|preventDefault={setTask}>
    <input type="text" required />
    <input type="date" />
    <button type="submit">Save task</button>
  </form>
</div>

<style>
</style>
