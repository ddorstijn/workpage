<script lang="ts">
  import ProjectItem from "../list-items/ProjectItem.svelte";
  import type { Project } from "../../database/database";
  import * as db from "../../database/LoveFieldModule";

  import { onDestroy, onMount } from "svelte";

  let projects: Project[] = [];
  let filterInput = "";

  onMount(async () => {
    projects = await db.projects.get();
    db.projects.subscribe(callback);
  });

  onDestroy(() => {
    db.projects.unsubscribe(callback);
  });

  async function callback(project: Project): Promise<void> {
    projects = await db.projects.get();
  }

  function filtered_list(list: Project[], filter: string): Project[] {
    return list.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()));
  }
</script>

<header>
  <div class="title-bar">
    <h1 class="is-marginless">Projects</h1>
    <div class="action-menu">
      <!-- Filter -->
      <label id="search__wrapper">
        <input
          id="search__input"
          type="search"
          placeholder="Search project..."
          bind:value={filterInput}
        />
        <i class="button material-icons">search</i>
      </label>
    </div>
  </div>
</header>

<div id="projects">
  <ul id="projects__list">
    {#each filtered_list(projects, filterInput) as projectItem}
      <ProjectItem {projectItem} />
    {/each}
  </ul>
</div>

<style>
  header {
    border-bottom: 1px solid var(--color-lightGrey);
    width: 20vw;
    min-width: 300px;
  }

  .title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .action-menu {
    display: flex;
    align-items: center;
  }

  #projects__list {
    list-style: none;
    padding: 0;
  }

  /* Searching */
  #search__wrapper {
    padding: 0.5rem 0.75rem;
    margin: 0 1rem 0 2rem;

    display: flex;
    align-items: center;
    gap: 0.25rem;
    border-radius: 999px;
    border: 1px solid var(--color-lightGrey);
  }

  #search__wrapper .material-icons {
    font-size: 1.8rem;
    background-color: transparent;
    padding: 0;
  }

  #search__input {
    width: 15ch;
    border: none;
    font-size: 1.4rem;
    background-color: transparent;
    padding: 0 0 0 0.5rem;
  }

  #search__input:focus {
    box-shadow: none;
    outline: none;
  }
</style>
