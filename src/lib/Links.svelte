<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { project } from "../store";

  import type { LinkGroup } from "src/database/database";
  import * as db from "../database/LoveFieldModule";

  import LinkGroupItem from "./list-items/LinkGroupItem.svelte";

  let linkgroups = [] as LinkGroup[];

  onMount(() => {
    fetchLinks();
    db.linkgroups.subscribe(fetchLinks);
  });

  project.subscribe(fetchLinks);
  
  async function fetchLinks() {
    linkgroups = await db.linkgroups.get($project);
  }
  
  onDestroy(() => db.linkgroups.unsubscribe(fetchLinks));
</script>

<ul class="linkgroups">
  {#each linkgroups as linkgroup}
    <LinkGroupItem {linkgroup} />
  {/each}
</ul>

<style>
  .linkgroups {
    margin: 6rem 0 0;
    padding: 0;

    display: flex;
    gap: 3rem;

    list-style: none;
  }
</style>
