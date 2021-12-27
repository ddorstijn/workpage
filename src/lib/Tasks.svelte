<script lang="ts">
  import CalendarModal from "./modals/CalendarModal.svelte";
  import TaskItem from "./list-items/TaskItem.svelte";

  import Flatpickr from "svelte-flatpickr";
  import "flatpickr/dist/flatpickr.css";

  import { onDestroy, onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import { modal, project } from "../store";
  import type { Project, Task } from "src/database/database";
  import * as db from "../database/LoveFieldModule";

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // -- Members -- \\
  let expanded = false;
  let sortMethod = "d";

  let unsortedTasks: Task[] = [];
  let tasks: { [items: string]: Task[] } = {};
  let newTask: Task = { name: "", priority: 0, projectId: $project?.id };

  onMount(async () => {
    unsortedTasks = (await db.tasks.get($project)).filter((task) => !task.done);
    sortTasks();
    db.tasks.subscribe(callback);
  });

  onDestroy(() => db.tasks.unsubscribe(callback));

  async function callback(task: Task): Promise<void> {
    unsortedTasks = (await db.tasks.get($project)).filter((task) => !task.done);
    sortTasks();
  }

  project.subscribe(async (newProject: Project) => {
    if (!newProject) {
      unsortedTasks = [];
      sortTasks();
      return;
    }

    unsortedTasks = await db.tasks.get(newProject);
    sortTasks();
  });

  // -- Functions -- \\
  function openCalendar(): void {
    modal.set(CalendarModal);
  }

  function dateDiffInDays(a: Date, b: Date) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  function sortTasks() {
    if (sortMethod == "d") {
      sortTasksDate();
    } else {
      sortTasksPriority();
    }
  }

  function sortTasksPriority() {
    let sorted = {
      "High priority": [],
      "Medium priority": [],
      "Low priority": [],
      "No priority": [],
    };

    for (const task of unsortedTasks) {
      if (task.done != null) {
        continue;
      }

      if (task.priority == 3) {
        sorted["High priority"].push(task);
      } else if (task.priority == 2) {
        sorted["Medium priority"].push(task);
      } else if (task.priority == 1) {
        sorted["Low priority"].push(task);
      } else {
        sorted["No priority"].push(task);
      }
    }

    tasks = sorted;
  }

  function sortTasksDate() {
    let sorted = {
      Overdue: [],
      Today: [],
      "This week": [],
      "Long term": [],
      Someday: [],
    };

    for (const task of unsortedTasks) {
      if (task.done != null) {
        continue;
      }

      if (!task.due) {
        sorted["Someday"].push(task);
        continue;
      }

      const dateDiff = dateDiffInDays(new Date(), task.due);
      if (dateDiff < 0) {
        sorted["Overdue"].push(task);
      } else if (dateDiff == 0) {
        sorted["Today"].push(task);
      } else if (dateDiff > 7) {
        sorted["Long term"].push(task);
      } else if (dateDiff > 0) {
        sorted["This week"].push(task);
      }
    }

    tasks = sorted;
  }

  function addTask() {
    if (!newTask.due) {
      newTask.due = null;
    }

    db.tasks.add(newTask);
    newTask = { name: "", priority: 0, projectId: $project.id };
  }
</script>

<article class="task">
  <header>
    <div class="title-bar">
      <h1 class="is-marginless">{$_("tasks.name", {default: "Tasks"})}</h1>
      <div class="title-bar__actions">
        <button
          class="btn--icon [ is-paddingless ] [ material-icons ]"
          on:click={openCalendar}>history</button
        >
        <button
          class="btn--accent [ button primary ]"
          on:click={() => (expanded = !expanded)}
        >
          {#if expanded}
            {$_("tasks.form.close", { default: "Close" })}
            <i class="material-icons">remove</i>
          {:else}
            {$_("tasks.form.new", { default: "New" })}
            <i class="material-icons">add</i>
          {/if}
        </button>
      </div>
    </div>
    {#if expanded}
      <form
        class="task-form row"
        class:expanded
        on:submit|preventDefault={addTask}
      >
        <div class="col">
          <input
            name="name"
            placeholder={$_("tasks.form.placeholders.name", {
              default: "Task name",
            })}
            required
            bind:value={newTask.name}
          />
          <div class="row">
            <Flatpickr
              name="due"
              class="picker col-7"
              placeholder={$_("tasks.form.placeholders.due", {
                default: "Due date",
              })}
              title="Due date"
              bind:value={newTask.due}
            />
            <select name="priorty" class="col" bind:value={newTask.priority}>
              <option value={0} class="text-grey" selected>
                {$_("tasks.priority.no", { default: "No priority" })}
              </option>
              <option value={1}>
                {$_("tasks.priority.low", { default: "Low priority" })}
              </option>
              <option value={2}>
                {$_("tasks.priority.medium", { default: "Medium priority" })}
              </option>
              <option value={3}>
                {$_("tasks.priority.high", { default: "High priority" })}
              </option>
            </select>
          </div>
        </div>
        <button class="button clear" type="submit">
          {$_("tasks.form.add", { default: "Add" })}
        </button>
      </form>
    {/if}
  </header>

  <label class="filter [ pull-right ]">
    <small>
      {$_("tasks.list.sort-by", { default: "Sort by" })}
    </small>
    <select bind:value={sortMethod} on:change={sortTasks}>
      <option value="d">
        {$_("tasks.list.date", { default: "Date" })}
      </option>
      <option value="p">
        {$_("tasks.list.priority", { default: "Priority" })}
      </option>
    </select>
  </label>

  {#if !unsortedTasks.length}
    <span class="no-tasks">
      {$_("tasks.list.empty", { default: "All done here!" })}
    </span>
  {/if}

  {#each Object.entries(tasks) as [name, items]}
    {#if items.length}
      <details class="item-list-container" open>
        <summary class="button icon">
          {name}
          <i class="material-icons details-icon">expand_less</i>
        </summary>
        <ul class="item-list">
          {#each items as task}
            <TaskItem {task} />
          {/each}
        </ul>
      </details>
    {/if}
  {/each}
</article>

<style lang="scss">
  .task {
    margin: 2rem;
    padding: 2rem;
    box-shadow: none;

    & > header {
      border-bottom: 1px solid var(--color-lightGrey);

      .title-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .title-bar__actions {
    display: flex;
    align-items: center;

    .btn--icon {
      background-color: transparent;
      font-size: 1.8rem;
    }
  }

  .btn--accent {
    padding: 0.5rem 1rem;
    margin-left: 0.5rem;
    border-radius: 999px;
    font-size: 1.4rem;
    display: flex;
    gap: 0.25rem;

    .material-icons {
      font-size: 1.8rem;
    }
  }

  .task-form input,
  .task-form select,
  .task-form :global(.picker) {
    background-color: white;
    margin-top: 1rem;
  }

  .item-list {
    padding: 0 1.5rem;
    margin: 0;
    list-style: none;

    max-height: 50vh;
    overflow-y: auto;
  }

  .item-list-container {
    margin-top: 1rem;

    summary {
      padding: 0;
      margin-left: 1rem;
      font-size: 1.4rem;
      font-weight: 500;
      white-space: nowrap;
      background-color: transparent;
      color: var(--color-grey);
    }

    .details-icon {
      transition: transform 0.25s ease-out;
    }

    &[open] .details-icon {
      transform: rotateX(180deg);
    }
  }

  .filter {
    display: flex;
    align-items: center;
    white-space: nowrap;

    select {
      padding: 0;
      margin: 0;
      border: none;

      font-size: 1.4rem;
      appearance: none;
      background-image: none;
      cursor: pointer;

      &:focus {
        border: none;
        outline: none;
        box-shadow: none;
      }
    }
  }

  .no-tasks {
    width: 100%;
    margin-top: 2rem;
    color: var(--color-grey);

    display: flex;
    justify-content: center;
  }
</style>
