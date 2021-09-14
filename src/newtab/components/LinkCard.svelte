<script>
  import { activeModal, editRef } from "../../store.js";
  import Datebase from "../../database.js";
  import LinkGroupModal from "./modals/LinkGroupModal.svelte";
  import LinkItem from "./list-items/LinkItem.svelte";
  import Menu from "./menu/Menu.svelte";
  import { onMount } from "svelte";

  export let linkGroup;
  let links = [];
  let hovering = false;

  onMount(async () => {
    links = await Datebase.getLinks(linkGroup.id);
  });

  function remove() {
    Datebase.removeLinkGroup(linkGroup.id);
  }

  function edit() {
    $editRef = linkGroup.id;
    $activeModal = LinkGroupModal;
  }
</script>

<div class="card linkGroup">
  <header
    on:mouseover={() => (hovering = true)}
    on:mouseout={() => (hovering = false)}
    on:focus={() => (hovering = true)}
    on:blur={() => (hovering = false)}
  >
    {linkGroup.name}
    <Menu {hovering} on:edit={edit} on:remove={remove} />
  </header>
  <ul class="linkGroup__itemlist">
    {#each links as link}
      <LinkItem {link} />
    {/each}
  </ul>
</div>

<style>
  .card.linkGroup {
    width: 15vw;
    height: max-content;
    border-radius: 4px;
    border-left: solid 6px var(--color-primary);
  }

  .linkGroup__itemlist {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .card header {
    margin-bottom: 1rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    font-size: 2.4rem;
    font-weight: bold;
    line-height: 1.2em;
  }
</style>
