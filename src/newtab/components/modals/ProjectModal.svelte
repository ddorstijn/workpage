<script>
  import { activeProject } from "../../../store.js";
  import Database from "../../../database.js";
  import Modal from "./Modal.svelte";
  import { onMount } from 'svelte';
  
  export let open;

  let projects = [];
  let filter_input = "";

  onMount(async () => {
		projects = await Database.getProjects();
	});

  function filtered_list(list, filter) {
    return list.filter(item => item.name.includes(filter));
  }

  function setActive(project) {
    $activeProject = project.name;
    open = false;
  }

  function daysDifference(date) {
    var diff = new Date().setHours(12) - new Date(+date).setHours(12);
    return Math.round(diff / 8.64e7);
  }
</script>

<Modal bind:open={open}>
  <header>
    <h2>Projects</h2>
    <div class="modal__actions">
      <!-- Filter -->
      <div id="search__wrapper">
        <label for="search__input" class="material-icons">search</label>
        <input id="search__input" type="search" placeholder="Search project..." bind:value={filter_input} />
      </div>

      <a id="settings_btn" class="button icon-only material-icons">settings</a>
    </div>
  </header>
  <div id="projects">
    <ul id="projects__list">
      {#each filtered_list(projects, filter_input) as project}
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
</Modal>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal__actions {
    margin-left: 4rem;

    display: flex;
    align-items: center;
    gap: .25rem;
  }

  .modal__actions .material-icons {
    font-size: 1.8rem;
    color: var(--color-darkGrey);
  }

  #search__wrapper {
    padding: 0.5rem 1rem;
    max-width: 20rem;
    
    display: flex;
    align-items: center;
    gap: .25rem;

    border-radius: 999px;
    border: 1px solid var(--bg-color);
    transition: border-color 0.5s ease-in;
  }

  #search__wrapper:focus-within {
    border: 1px solid var(--color-lightGrey);
  }
  
  #search__input {
    width: 0;
    border: none;
    font-size: 1.4rem;
    background-color: transparent;
    padding: 0;

    transition: width 0.5s ease-in;
  }

  #search__input:focus {
    width: 20rem;
    box-shadow: none;
  }

  #settings_btn {
    background-color: transparent;
    padding: 0;
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
