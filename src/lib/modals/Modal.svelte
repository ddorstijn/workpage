<script>
  import { editRef, modal } from "../../store";
  import { fade } from "svelte/transition";

  function close() {
    $editRef = null;
    $modal = null;
  }
</script>

{#if $modal}
  <div class="modal" transition:fade={{ duration: 200 }}>
    <div class="modal__close" on:click={close} />
    <div class="modal__content [ card ]">
      <svelte:component this={$modal} />
    </div>
  </div>
{/if}

<style lang="scss">
  .modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.25);

    .modal__content {
      padding: 2rem;
      z-index: 20;
    }

    .modal__close {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #34495e;
      opacity: 0.4;
      transition: opacity 200ms;

      &:hover {
        opacity: 0.3;
      }
    }
  }
</style>
