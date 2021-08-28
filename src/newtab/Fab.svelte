<script>
  import LinkGroupModal from "./components/modals/LinkGroupModal.svelte";
</script>

<input id="fabCheckbox" type="checkbox" class="is-hidden" />
<label
  class="fab button icon-only material-icons [ bg-error text-white is-rounded ]"
  for="fabCheckbox"
>
  add
</label>
<div class="fab-wheel">
  <button
    id="fab-action-1"
    class="fab-action button icon-only material-icons [ is-rounded ]"
    title="Add task"
  >
    assignment
  </button>
  <button
    id="fab-action-2"
    class="fab-action button icon-only material-icons [ is-rounded ]"
    title="Add link group"
  >
    folder
  </button>
  <button
    id="fab-action-3"
    class="fab-action button icon-only material-icons [ is-rounded ]"
    title="Add link"
  >
    link
  </button>
</div>
<LinkGroupModal></LinkGroupModal>

<style>
  .fab {
    position: absolute;
    bottom: -0;
    right: 0;
    z-index: 1;
  }

  .fab-wheel {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12rem;
    height: 12rem;
    transition: all 0.3s ease;
    transform-origin: bottom right;
    transform: scale(0);
  }

  #fabCheckbox:checked ~ .fab-wheel {
    transform: scale(1);
  }

  .fab-action {
    position: absolute;
    margin: 0;
    transition: all 0.25s ease;

    font-size: 1.6rem;
    opacity: 0;
  }

  #fabCheckbox:checked ~ .fab-wheel .fab-action {
    opacity: 1;
  }

  .fab-wheel #fab-action-1 {
    right: 0rem;
    top: 0;
  }

  .fab-wheel #fab-action-2 {
    right: 5.65685424949rem;
    bottom: 5.65685424949rem;
  }
  .fab-wheel #fab-action-3 {
    left: 0rem;
    bottom: 0rem;
  }
</style>
