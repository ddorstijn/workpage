<script>
  import { onMount } from "svelte";
  import * as db from "../database/LoveFieldModule";

  import { modal, project } from "../store";
  import ProjectModal from "./modals/ProjectModal.svelte";

  onMount(async () => {
    const projects = await db.projects.get(); 
    if (projects.findIndex(p => p.id == $project.id) == -1) {
      $project = null;
    }
  })

  function openModal() {
    modal.set(ProjectModal);
  }
</script>

<article>
  <button id="project__button" class="button primary" on:click="{openModal}">
    {#if $project == null}
        Click to open project
    {:else}
        {$project.name}
    {/if}
  </button>
</article>

<style>
  #project__button {
    padding: 12px 24px;
    
    border-radius: 999px;
    box-shadow: rgb(0 0 0 / 10%) 0px 2px 6px, rgb(0 0 0 / 10%) 0px 4px 16px;
    
    font-size: 1.8rem;
    font-weight: 600;
    letter-spacing: -0.2px;
  }
</style>
