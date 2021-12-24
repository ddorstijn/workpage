<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { project } from "../store";

  import * as db from "../database/LoveFieldModule";

  import LinkCard from "./LinkCard.svelte";
  import type { LinkGroup, Project } from "src/database/database";

  let linkgroups = [] as LinkGroup[];

  onMount(async () => {
    db.linkgroups.subscribe(callback);
    linkgroups = await db.linkgroups.get($project);
  });

  onDestroy(() => db.linkgroups.unsubscribe(callback));

  async function callback(linkgroup: LinkGroup) {
    linkgroups = await db.linkgroups.get($project);
  }

  project.subscribe(async (newProject: Project) => {
    if (!newProject || !db) {
      linkgroups = [];
      return;
    }
    
    linkgroups = await db.linkgroups.get(newProject);
  })
</script>

<article>
  {#each linkgroups as linkgroup}
    <LinkCard {linkgroup} />
  {/each}
</article>

<style>
  article {
    margin-top: 4rem;
    display: flex;
    gap: 2rem;
  }
</style>
