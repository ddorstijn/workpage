<script lang="ts">
  import LinkCard from "./LinkCard.svelte";

  import Database from "../database/LoveField";
  import type { LinkGroup } from "src/database/database";

  import { onDestroy, onMount } from "svelte";
  import { activeProject } from "../store";


  let db: Database;
  let linkGroups = [];

  onMount(async () => {
    db = await Database.getInstance();
    db.linkgroups.subscribe(callback);
  });

  onDestroy(() => db.linkgroups.unsubscribe(callback));

  function callback(data: LinkGroup[]) {
    linkGroups = data;
  }
</script>

<article>
  {#each linkGroups as linkGroup}
    <LinkCard {linkGroup} />
  {/each}
</article>

<style>
  article {
    margin-top: 4rem;
    display: flex;
    gap: 2rem;
  }
</style>
