<script>
  import { activeModal, activeProject, editRef, dirty } from "../../../store.js";
  import Database from "../../../database.js";
  import { onMount } from "svelte";

  let id = null;
  let title = "";
  let due = "";
  let done = false;

  onMount(async () => {
    if (!$editRef) return;

    id = $editRef;
    const task = await Database.getTask(id);

    title = task[0].title;
    due = task[0].due.toLocaleDateString('en-CA');
    done = task[0].done;
  });

  function addGroup(e) {
    if (id) {
      Database.updateTask(id, title, new Date(due), done);
    } else {
      Database.addTask(title, new Date(due), $activeProject);
    }
    
    e.target.reset();
    $dirty.push("tasks");
    $editRef = null;
    $activeModal = null;
  }
</script>

<header>Task</header>
<div>
  <form on:submit|preventDefault={addGroup}>
    <input type="text" bind:value={title} required />
    <input type="date" bind:value={due} />
    <button type="submit">Save task</button>
  </form>
</div>

<style>
  
</style>