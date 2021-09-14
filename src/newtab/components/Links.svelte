<script>
  import { activeProject } from "../../store.js";
  import Database from "../../database";
  import LinkCard from "./LinkCard.svelte";

  let linkGroups = [];

  activeProject.subscribe((projectName) => {
    if (!projectName) return;

    Database.getLinkGroups(projectName).then((res) => linkGroups = res);
  });
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
