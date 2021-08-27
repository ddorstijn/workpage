<script>
  import SortableGroup from "./SortableGroup.svelte";
  import LinkItem from "./LinkItem.svelte";

  import { links } from "../../store.js";
  import { children } from "svelte/internal";

  // -- Functions -- \\
  async function addGroup() {}

  async function removeGroup(group) {}

  function flatToTree() {
    let tree = [];
    for (let link of $links) {
      if (tree.length == 0 || tree[tree.length - 1].id != link.LinkGroups.id) {
        tree.push({ ...link.LinkGroups, ...{ children: [] } });
      }

      tree[tree.length - 1].children.push(link.Links);
    }

    console.log(tree);
    return tree;
  }
</script>

<article>
  {#each flatToTree() as linkGroup}
    <div class="card linkGroup">
      <header>
        {linkGroup.name}
        <button
          class="button clear icon-only material-icons"
        >
          more_vert
        </button>
      </header>
      <ul class="linkGroup__itemlist">
        {#each linkGroup.children as link}
          <li>{link.name}</li>
        {/each}
      </ul>
    </div>
  {/each}
</article>

<style>
  article {
    margin-top: 4rem;
    display: flex;
    gap: 2rem;
  }

  .card.linkGroup {
    width: 15vw;
    height: max-content;
    border-radius: 8px;
    border-left: solid 6px var(--color-primary);
  }

  .linkGroup__itemlist {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .linkGroup__itemlist li {
    font-size: smaller;
  }

  .card header {
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: space-between;
    font-size: 1.8rem;
    font-weight: bold;
  }

	.card header button {
		margin: 0;
		padding: 0;

		opacity: 0;
		font-size: 16px;
	}

	.card:hover header button {
		opacity: 1;
	}
</style>
