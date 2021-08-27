<script>
  export let open = false;
</script>

<div class="modal" class:open="{open}">
  <!-- svelte-ignore a11y-invalid-attribute -->
  <!-- svelte-ignore a11y-missing-content -->
  <div class="modal__close" on:click="{() => open = false}" />
  <div class="modal__content card">
    <slot></slot>
  </div>
</div>

<style>
  .modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 200ms;

    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.25);
  }

  .modal.open {
    pointer-events: all;
    opacity: 1;
  }

  .modal__content {
    width: 30vw;
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
  }

  .modal__close:hover {
    opacity: 0.3;
  }
</style>