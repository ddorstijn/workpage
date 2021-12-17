<script>
  import { modal } from "../../store";
  import { onMount } from "svelte";

  let id = null;
  let name = "";
  let url = "";
  let groupId = null;

  let linkGroups = [];
  function addLink(e) {
    e.target.reset();
    $modal = null;
  }

  onMount(async () => {
  });
</script>

<header>Link</header>
<div>
  <form on:submit|preventDefault={addLink}>
    <input type="text" placeholder="Name" bind:value={name} required>
    <input type="url" placeholder="url" bind:value={url} required>
    <select bind:value={groupId}>
      {#each linkGroups as linkGroup}
        <option value={linkGroup.id}>{linkGroup.name}</option>
      {/each}
    </select>
    <button type="submit">Save link</button>
  </form>
</div>

<style>
  header {
    text-align: center;
    font-weight: bolder;
    margin-bottom: 2rem;
  }

  input {
    margin-bottom: 1rem;
  }

  button {
    display: block;
    margin: 2rem auto 0;
  }
</style>