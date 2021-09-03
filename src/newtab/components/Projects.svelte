<script>
  import { activeModal, activeProject } from "../../store.js";
  import ProjectModal from "./modals/ProjectModal.svelte";

  function openModal() {
    activeModal.set(ProjectModal);
  }
</script>

<article>
  <button id="project__button" class="button primary" on:click="{openModal}">
    {$activeProject ?? "Click to open project"}
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
