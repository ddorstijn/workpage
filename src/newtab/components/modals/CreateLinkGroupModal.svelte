<script>
  import { activeModal, activeProject } from "../../../store.js";
  import Database from "../../../database.js";

  let input = "";
  function addGroup(e) {
    e.preventDefault();
    Database.addLinkGroup(input, $activeProject);
    e.target.reset();
    $activeModal = null;
  }
</script>

<header>Create link group</header>
<div>
  <form on:submit={addGroup}>
    <input type="text" bind:value={input} required>
    <button type="submit">Add group</button>
  </form>
</div>

<style>
  
</style>