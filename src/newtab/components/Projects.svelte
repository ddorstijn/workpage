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
    margin: 0rem 0;
    padding: 12px 24px;
    border-radius: 50px;
    font-weight: 500;
    font-size: 18px;
    filter: drop-shadow(1px 2px 8px rgba(0, 0, 0, 0.25));
  }
</style>
