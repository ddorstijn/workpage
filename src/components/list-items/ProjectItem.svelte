<script lang="ts">
  import { db, modal, project } from "@/lib/store";

  import Menu from "../menu/Menu.svelte";

  import type { Project } from "@/lib/database/types";
  import { tick } from "svelte";
  
  export let projectItem: Project;

  let hovering = false;
  let editing = false;
  let editInput: HTMLInputElement;

  function setActive(): void {
    project.set(projectItem);
    $modal = null;
  }

  function edit(): void {
    editing = true;
    tick().then(() => editInput.focus());
  }

  function remove(): void {
    db.projects.remove(projectItem);
  }

  function saveEdit(): void {
    editing = false;
    db.projects.update(projectItem);
  }

  function daysDifference(date: Date): string {
    const diff = new Date().setHours(12) - new Date(+date).setHours(12);
    const diffDays = Math.round(diff / 8.64e7);
    if (diffDays == 0) {
      return "Today";
    }

    return `${diffDays} days ago`;
  }
</script>

<li
  on:click|self={setActive}
  on:mouseover={() => (hovering = true)}
  on:mouseout={() => (hovering = false)}
  on:focus={() => (hovering = true)}
  on:blur={() => (hovering = false)}
>
  <span>w</span>
  <div class="text">
    {#if !editing}
      <div class="title">{projectItem.name}</div>
    {:else}
      <form class="edit-form" on:submit|preventDefault={saveEdit}>
        <input type="text" bind:this={editInput} bind:value={projectItem.name} on:blur={saveEdit} placeholder="Project name" required>
        <input type="submit" class="is-hidden">
      </form>
    {/if}
    <small class="text-grey">
      <span class="material-icons">history</span>
      {daysDifference(projectItem.used)}
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

  .text {
    user-select: none;
    pointer-events: none;
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
    pointer-events: all;
  }
</style>
