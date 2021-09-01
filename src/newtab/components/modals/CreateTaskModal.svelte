<script>
  import { activeModal, activeProject } from "../../../store.js";
  import Database from "../../../database.js";

  let title;
  let due;

  function addGroup(e) {
    e.preventDefault();
    Database.addTask(title, new Date(due), $activeProject);
    e.target.reset();
    $activeModal = null;
  }
</script>

<header>Create task</header>
<div>
  <form on:submit={addGroup}>
    <input type="text" bind:value={title} required />
    <input type="date" bind:value={due} />
    <button type="submit">Add task</button>
  </form>
</div>

<style>
  
</style>