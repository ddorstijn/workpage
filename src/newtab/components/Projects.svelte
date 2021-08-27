<script>
  import { activeProject } from "../../store.js";
  import Modal from "./modals/Modal.svelte";
  import ProjectModal from "./modals/ProjectModal.svelte";

  let openModal = false;
</script>

<article>
  <button id="project__button" class="button primary" on:click="{() => openModal = true}">
    {$activeProject ?? "Open project"}
  </button>
  <Modal bind:open="{openModal}" modalComponent={ProjectModal} />
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
