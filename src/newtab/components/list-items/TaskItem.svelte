<script>
  import Checkbox from "../Checkbox.svelte";
  import Menu from "../menu/Menu.svelte";
  import { activeModal, editRef } from "../../../store.js";
  import Database from "../../../database.js";
  import TaskModal from "../modals/TaskModal.svelte";

  export let task;
  let hovering = false;

  function edit() {
    $editRef = task.id;
    $activeModal = TaskModal;
  }

  function remove() {
    Database.removeTask(task.id);
  }

  function pretty_date(date) {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
    }).format(date);
  }
</script>

<li
  on:mouseover={() => (hovering = true)}
  on:mouseout={() => (hovering = false)}
  on:focus={() => hovering = true}
  on:blur={() => hovering = false}
>
  <Checkbox bind:checked={task.done} />
  <div class="text">
    <div class="title">{task.title}</div>
    <small class="text-grey"
      ><span class="material-icons">event</span>{pretty_date(task.due)}</small
    >
  </div>
  <Menu {hovering} on:edit={edit} on:remove={remove} />
</li>

<style>
  li {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;

    display: flex;
    align-items: center;
    gap: 1.5rem;

    line-height: 1.3;
    cursor: pointer;
  }

  li:hover {
    background-color: var(--color-lightGrey);
  }

  .title {
    font-weight: 500;
  }

  small {
    font-size: 1.2rem;
    font-weight: 300;

    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  small .material-icons {
    font-size: 1.2rem;
  }
</style>
