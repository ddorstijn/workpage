<script>
  import { modal } from "../../store";
  import { onMount } from "svelte";

  let id = null;
  let groupName = "";

  function addGroup(e) {
    e.target.reset();
    $modal = null;
  }

  onMount(async () => {
  });
</script>

<header>Link group</header>
<div>
  <form on:submit|preventDefault={addGroup}>
    <input type="text" bind:value={groupName} required>
    <button type="submit">Save group</button>
  </form>
</div>

<style>
  header {
    text-align: center;
    font-weight: bolder;
    margin-bottom: 2rem;
  }

  button {
    display: block;
    margin: 2rem auto 0;
  }
</style>