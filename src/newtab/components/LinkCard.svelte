<script>
  import { activeModal } from "../../store.js";
  import Datebase from "../../database.js";
  import LinkGroupModal from "./modals/LinkGroupModal.svelte";
  import LinkItem from "./list-items/LinkItem.svelte";
  import Menu from "./menu/Menu.svelte";

  export let linkGroup;
  let hovering = false;

  function remove() {
    Datebase.removeLinkGroup(linkGroup.id);
  }

  function edit() {
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
    {#each linkGroup.children as link}
      <LinkItem item={link} />
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
