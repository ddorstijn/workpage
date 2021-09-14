<script>
  import Menu from "../menu/Menu.svelte";
  import { activeModal, editRef, dirty } from "../../../store.js";
  import LinkModal from "../modals/LinkModal.svelte";
  import Database from "../../../database.js";

  export let link;
  let hovering = false;

  function edit() {
    $editRef = link.id;
    $activeModal = LinkModal;
  }

  function remove() {
    Database.removeLink(link.id);
  }
</script>

<li
  class="link-item"
  on:mouseover={() => (hovering = true)}
  on:mouseout={() => (hovering = false)}
  on:focus={() => (hovering = true)}
  on:blur={() => (hovering = false)}
>
  <a href={link.url}>{link.name}</a>
  <Menu {hovering} on:edit={edit} on:remove={remove} />
</li>

<style>
  .link-item {
    position: relative;
    margin-bottom: 0.25rem;

    display: flex;
  }

  .link-item > a {
    font-size: 1.6rem;
    font-weight: 300;
    line-height: 1.2em;

    color: var(--color-grey);
  }
</style>
