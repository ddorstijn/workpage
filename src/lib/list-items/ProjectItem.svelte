<script lang="ts">
  import { modal } from "../../store";
  import Menu from "../menu/Menu.svelte";

  export let project;
  let hovering = false;
  let editing = false;
  let editTitle = "";

  function setActive(project) {
    $modal = null;
  }

  function edit() {
    editTitle = project.name;
    editing = true;
  }

  function remove() {
  }

  function saveEdit() {
    editing = false;
  }

  function daysDifference(date) {
    const diff = new Date().setHours(12) - new Date(+date).setHours(12);
    const diffDays = Math.round(diff / 8.64e7);
    if (diffDays == 0) {
      return "Today";
    }

    return `${diffDays} days ago`;
  }
</script>

<li
  on:click|self={() => setActive(project)}
  on:mouseover={() => (hovering = true)}
  on:mouseout={() => (hovering = false)}
  on:focus={() => (hovering = true)}
  on:blur={() => (hovering = false)}
>
  <span>w</span>
  <div class="text">
    {#if !editing}
      <div class="title">{project.name}</div>
    {:else}
      <form class="edit-form" on:submit|preventDefault={saveEdit}>
        <input type="text" bind:value={editTitle}>
        <button type="submit">Save</button>
      </form>
    {/if}
    <small class="text-grey">
      <span class="material-icons">history</span>
      {daysDifference(project.last_used)}
    </small>
  </div>
  <Menu {hovering} on:edit={edit} on:remove={remove} />
</li>

<style>
  li {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    line-height: 1.3;
    cursor: pointer;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
  }

  li:hover {
    background-color: var(--color-lightGrey);
  }

  .title {
    font-weight: 500;
  }

  small {
    font-size: 1.2rem;
    font-weight: 300;

    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  small .material-icons {
    font-size: 1.2rem;
  }

  .edit-form {
    display: flex;
  }
</style>
