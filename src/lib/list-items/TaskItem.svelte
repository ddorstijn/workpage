<script lang="ts">
  import Menu from "../menu/Menu.svelte";
  import { editRef, modal } from "../../store";
  import TaskModal from "../modals/TaskModal.svelte";
  import type { Task } from "src/database/database";
  import * as db from "../../database/LoveFieldModule";

  export let task: Task;

  let hovering = false;

  function edit() {
    $editRef = task;
    $modal = TaskModal;
  }

  function remove() {
    db.tasks.remove(task);
  }

  function mark() {
    task.done = task.done ? null : new Date();
    db.tasks.update(task);
  }

  function pretty_date(date: Date): string {
    if (!date) return "-";
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
    }).format(date);
  }

  function pretty_priority(priority: number): string {
    const priorities = ["", "Low", "Medium", "High"];
    return priorities[priority];
  }
</script>

<li
  on:mouseover={() => (hovering = true)}
  on:mouseout={() => (hovering = false)}
  on:focus={() => hovering = true}
  on:blur={() => hovering = false}
>
  <label class:check={task.done}>
    <input class="is-hidden" type="checkbox" checked={task.done != null} on:change={mark} />
  </label>
  
  <div class="text">
    <div class="title">{task.name}</div>
    <small class="text-grey">
      <div class="is-vertical-align">
        <span class="due-icon material-icons">event</span>
        {pretty_date(task.due)}
      </div>
      {#if task.priority > 0}
        <div class="is-vertical-align" class:text-light={task.priority == 1} class:text-error={task.priority == 3}>
          <span class="priority-icon material-icons">priority_high</span>
          {pretty_priority(task.priority)}
        </div>
      {/if}
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
    gap: 0.5rem;
  }

  small .material-icons {
    font-size: 1.4rem;
  }

  small .due-icon {
    margin-right: 0.25rem;
  }
  
  label {
    position: relative;
    margin-right: 1.5rem;
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
