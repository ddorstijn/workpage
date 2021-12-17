<script lang="ts">
  import Menu from "../menu/Menu.svelte";
  import { modal } from "../../store";
  import TaskModal from "../modals/TaskModal.svelte";

  export let task;
  let hovering = false;

  function edit() {
    $modal = TaskModal;
  }

  function remove() {
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
  <label class:check={task.done}>
    <input class="is-hidden" type="checkbox" bind:checked={task.done} />
  </label>
  
  <div class="text">
    <div class="title">{task.title}</div>
    <small class="text-grey">
      <span class="material-icons">event</span>
      {pretty_date(task.due)}
    </small>
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
  
  label {
    position: relative;
    background-color: transparent;
    border: 1px solid var(--color-grey);
    border-radius: 50%;
    cursor: pointer;
    height: 24px;
    width: 24px;
    aspect-ratio: 1;
  }

  label:after {
    content: "";
    position: absolute;
    width: 50%;
    height: 25%;
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%) rotate(-45deg);
    opacity: 0;

    border: 2px solid white;
    border-top: none;
    border-right: none;
  }

  label.check {
    background-color: #66bb6a;
    border-color: #66bb6a;
  }

  label.check:after {
    opacity: 1;
  }
</style>
