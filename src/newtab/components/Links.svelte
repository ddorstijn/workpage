<script>
  import { activeProject } from "../../store.js";
  import Database from "../../database";
  import LinkCard from "./LinkCard.svelte";

  let links = [];

  activeProject.subscribe((val) => {
    if (!val) return;

    Database.getLinks(val).then((res) => (links = res));
  });

  function flatToTree(array) {
    let tree = [];
    for (let item of array) {
      // Only create root if it does not yet exist
      if (tree.length == 0 || tree[tree.length - 1].id != item.LinkGroups.id) {
        tree.push({ ...item.LinkGroups, ...{ children: [] } });
      }

      if (item.Links.id != null)
        tree[tree.length - 1].children.push(item.Links);
    }

    return tree;
  }
</script>

<article>
  {#each flatToTree(links) as linkGroup}
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
