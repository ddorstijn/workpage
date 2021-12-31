<script lang="ts">
  import { db, editRef, modal } from "@/lib/store";
  import { onDestroy, onMount } from "svelte";

  import type { Link, LinkGroup } from "@/lib/database/types";

  import LinkGroupModal from "../modals/LinkGroupModal.svelte";
  import LinkItem from "./LinkItem.svelte";
  import Menu from "../menu/Menu.svelte";

  export let linkgroup: LinkGroup;

  let links = [];
  let hovering = false;

  onMount(async () => {
    links = await db.links.get(linkgroup);
    db.links.subscribe(callback);
  });

  onDestroy(() => db.links.unsubscribe(callback));

  async function callback(link: Link) {
    if (link.groupId == linkgroup.id) {
      links = await db.links.get(linkgroup);
    }
  }

  function remove() {
    db.linkgroups.remove(linkgroup);
  }

  function edit() {
    $editRef = linkgroup;
    $modal = LinkGroupModal;
  }
</script>

<li class="card linkGroup">
  <header
    on:mouseover={() => (hovering = true)}
    on:mouseout={() => (hovering = false)}
    on:focus={() => (hovering = true)}
    on:blur={() => (hovering = false)}
  >
    {linkgroup.name}
    <Menu {hovering} on:edit={edit} on:remove={remove} />
  </header>
  <ul class="linkGroup__itemlist">
    {#each links as link}
      <LinkItem {link} />
    {/each}
  </ul>
</li>

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
    align-items: baseline;
    justify-content: space-between;
    gap: 2rem;

    font-size: 2.4rem;
    font-weight: bold;
    line-height: 1.2em;
  }
</style>
