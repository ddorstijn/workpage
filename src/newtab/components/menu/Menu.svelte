<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  export let hovering;
  let open = false;

  const dispatch = createEventDispatcher();

  let menuRef;
  function checkInside(e) {
    let targetElement = e.target;
    do {
      if (targetElement == menuRef) {
        return;
      }

      targetElement = targetElement.parentNode;
    } while (targetElement);

    open = false;
  }

  onMount(() => {
    window.addEventListener("click", checkInside);
  });

  function editItem() {
    dispatch("edit");
    open = false;
  }

  function removeItem() {
    dispatch("remove");
    open = false;
  }
</script>

<details class="dropdown" bind:open>
  <summary class="menu-btn material-icons" class:hovering>more_vert</summary>
  <ul class="card menu-item-list" bind:this={menuRef}>
    <li on:click={editItem}>Edit</li>
    <li on:click={removeItem}>Remove</li>
  </ul>
</details>

<style>
  .dropdown {
    margin-left: auto;
  }

  .menu-btn {
    padding: 0;

    font-size: 16px;
    opacity: 0;
    cursor: pointer;
  }

  .menu-btn:focus {
    opacity: 1;
  }

  .hovering {
    opacity: 1;
  }

  .menu-item-list {
    margin: 0;
    padding: 0;

    left: unset;
    right: 0;
    z-index: 10;

    list-style: none;
    font-size: 1.6rem;
    font-weight: normal;
  }

  .menu-item-list li {
    cursor: pointer;
    padding: 0.25rem 1rem;
  }

  .menu-item-list li:hover {
    background-color: var(--color-lightGrey);
  }
</style>
