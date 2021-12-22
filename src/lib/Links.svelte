<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { project } from "../store";

  import Database from "../database/LoveField";
  import LinkCard from "./LinkCard.svelte";
  import type { LinkGroup, Project } from "src/database/database";

  let db: Database;
  let linkGroups = [] as LinkGroup[];

  onMount(async () => {
    db = await Database.getInstance();
    db.linkgroups.subscribe(callback);
    linkGroups = await db.linkgroups.get($project.id as number);
  });

  onDestroy(() => db.linkgroups.unsubscribe(callback));

  function callback(data: LinkGroup[]) {
    linkGroups = data;
  }

  project.subscribe(async (newProject: Project) => {
    if (!newProject || !db) {
      linkGroups = [];
      return;
    }
    
    linkGroups = await db.linkgroups.get(newProject.id as number);
  })
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
