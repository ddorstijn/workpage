<script lang="ts">
  import { onMount } from "svelte";
  import { project } from "../store";

  import LinkCard from "./LinkCard.svelte";

  let linkGroups = [];

  onMount(() => {
    getLinkGroups();
  });
  
  function getLinkGroups() {
    
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
