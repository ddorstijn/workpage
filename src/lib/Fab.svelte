<script lang="ts">
  import { modal } from "../store";

  import LinkGroupModal from "./modals/LinkGroupModal.svelte";
  import LinkModal from "./modals/LinkModal.svelte";
  import TaskModal from "./modals/TaskModal.svelte";

  function openCreateTask() {
    modal.set(TaskModal);
  }

  function openCreateLinkGroup() {
    modal.set(LinkGroupModal);
  }

  function openCreateLink() {
    modal.set(LinkModal);
  }
</script>

<div class="fab">
  <ul class="fab-buttons">
    <li class="fab-buttons__item">
      <button class="fab-buttons__link [ is-rounded ]" data-tooltip="Task" on:click={openCreateTask}>
        <i class="material-icons">assignment</i>
      </button>
    </li>
    <li class="fab-buttons__item">
      <button class="fab-buttons__link [ is-rounded ]" data-tooltip="Link group" on:click={openCreateLinkGroup}>
        <i class="material-icons">folder</i>
      </button>
    </li>
    <li class="fab-buttons__item">
      <button class="fab-buttons__link [ is-rounded ]" data-tooltip="Link" on:click={openCreateLink}>
        <i class="material-icons">link</i>
      </button>
    </li>
  </ul>
  <span class="button icon-only [ bg-error text-white is-rounded ]">
    <i class="material-icons">add</i>
  </span>
</div>

<style>
.fab {
  position: fixed;
  right: 1.6rem;
  bottom: 1.6rem;
}

.fab-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
  opacity: 0;
  visibility: hidden;
  transition: 0.2s;
}

.fab:hover .fab-buttons {
  opacity: 1;
  visibility: visible;
}

.fab-buttons__link {
  padding: .5rem;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  transform: scaleY(0.5) scaleX(0.5) translateY(16px);
  transition: 0.3s;
}

.fab:hover .fab-buttons__link {
  transform: scaleY(1) scaleX(1) translateY(-16px);
}

[data-tooltip]:before {
  position: absolute;
  top: 50%;
  right: 100%;
  padding: 4px 7px;
  margin: 0px 12px;
  transform: translateY(-50%);

  font-weight: 600;
  white-space: nowrap;
  border-radius: 2px;
  color: var(--font-color);
  content: attr(data-tooltip);
  font-size: small;
  opacity: 0;

  transition: opacity 0.25s ease-in 0.3s;
}

.fab:hover [data-tooltip]:before {
  opacity: 1;
}
</style>
