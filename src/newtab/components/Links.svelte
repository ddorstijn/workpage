<script>
  import { activeProject } from "../../store.js";
  import LinkItem from "./list-items/LinkItem.svelte";
  import Database from "../../database";

  let links = [];
  activeProject.subscribe(val => {
    if (!val) return;

    Database.getLinks(val).then(res => links = res);
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
    <div class="card linkGroup">
      <header>
        {linkGroup.name}
        <button class="button clear icon-only material-icons">
          more_vert
        </button>
      </header>
      <ul class="linkGroup__itemlist">
        {#each linkGroup.children as link}
          <LinkItem item={link} />
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
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    font-size: 2.4rem;
    font-weight: bold;
    line-height: 1.2em;
  }

	.card header button {
		margin: 0;
		padding: 0;

		opacity: 0;
		font-size: 1.8rem;
	}

	.card:hover header button {
		opacity: 1;
	}
</style>
