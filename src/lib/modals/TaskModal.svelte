<script>
  import { modal } from "../../store";
  import { onMount } from "svelte";

  let id = null;
  let title = "";
  let due = "";
  let done = false;

  onMount(async () => {
  });

  function addTask(e) {
    e.target.reset();
    $modal = null;
  }
</script>

<header>Task</header>
<div>
  <form on:submit|preventDefault={addTask}>
    <input type="text" bind:value={title} required />
    <input type="date" bind:value={due} />
    <button type="submit">Save task</button>
  </form>
</div>

<style>
  
</style>