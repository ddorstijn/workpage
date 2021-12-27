<script>
  import { createEventDispatcher } from "svelte";

  export let hovering;

  const dispatch = createEventDispatcher();

  function editItem() {
    dispatch("edit");
  }

  function removeItem() {
    dispatch("remove");
  }
</script>

<ul class="menu" class:hovering>
  <li class="edit material-icons" title="Edit" on:click={editItem}>
    edit
  </li>
  <li class="delete material-icons" title="Delete" on:click={removeItem}>
    close
  </li>
</ul>

<style lang="scss">
  .menu {
    margin: 0 0 0 auto;
    padding: 0 0 0 0.35rem;
    opacity: 0;
    
    display: flex;
    gap: 0.4rem;
    list-style: none;

    li {
      padding: 0rem;
      font-size: 14px;
      color: var(--color-darkGrey);
    }
  }

  .edit:hover {
    color: var(--color-primary);
  }

  .delete:hover {
    color: var(--color-error)
  }

  .hovering {
    opacity: 1;
  }
</style>
