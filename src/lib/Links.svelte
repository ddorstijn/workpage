<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { project } from "../store";

  import type { LinkGroup, Project } from "src/database/database";
  import * as db from "../database/LoveFieldModule";

  import LinkGroupItem from "./list-items/LinkGroupItem.svelte";
  
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
