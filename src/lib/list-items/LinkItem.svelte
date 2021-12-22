<script lang="ts">
  import Menu from "../menu/Menu.svelte";
  import { modal } from "../../store";
  import LinkModal from "../modals/LinkModal.svelte";
  import { onMount } from "svelte";
  import Database from "../../database/LoveField";
   
  import type { Link } from "src/database/database";

  export let link: Link;
  
  let db: Database;
  let hovering = false;

  onMount(async () => {
    db = await Database.getInstance();
  })

  function edit() {
    $modal = LinkModal;
  }

  function remove() {
    db.links.remove(link);
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
