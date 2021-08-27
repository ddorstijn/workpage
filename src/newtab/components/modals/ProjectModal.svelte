<script>
  import { projects, activeProject } from "../../../store.js";
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  function setActive(project) {
    $activeProject = project.name;
    dispatch('close');
  }

  function daysDifference(date) {
    var diff = new Date().setHours(12) - new Date(+date).setHours(12);
    return Math.round(diff / 8.64e7);
  }
</script>

<header>
  <h2>Projects</h2>
  <button id="btn_addtodo" class="button primary icon">
    Project
    <i class="material-icons is-marginless">add</i>
  </button>
</header>
<div id="projects">
  <ul id="projects__list">
    {#each $projects as project}
      <li class="project__item">
        <span class="project_name" on:click={setActive(project)}>
          {project.name}
        </span>
        <small class="project_date text-grey">
          {daysDifference(project.last_used)} days ago
        </small>
      </li>
    {/each}
  </ul>
</div>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #btn_addtodo {
    gap: 0.5rem;
    border-radius: 999px;
    padding: 0.5rem 1rem 0.5rem 1.4rem;
    font-size: 1.4rem;
  }

  #projects__list {
    list-style: none;
    padding: 0;
  }

  .project_name {
    display: block;
    line-height: 1.2;
    font-weight: 500;
    cursor: pointer;
  }

  .project_date {
    font-weight: 200;
  }
</style>
