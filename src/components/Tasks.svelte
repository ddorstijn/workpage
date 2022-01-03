<script lang="ts">
  import CalendarModal from "./modals/CalendarModal.svelte";
  import DatePicker from "./DatePicker.svelte";
  import TaskItem from "./list-items/TaskItem.svelte";

  import { onDestroy, onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import { db, modal, project } from "@/lib/store";
  import type { Task } from "@/lib/database/types";

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // -- Members -- \\
  let expanded = false;
  let sortMethod = "d";

  let unsortedTasks: Task[] = [];
  let tasks: { [items: string]: Task[] } = {};
  let newTask: Task = { name: "", priority: 0, projectId: null };

  onMount(() => {
    fetchTasks();
    db.tasks.subscribe(fetchTasks);
  });

  project.subscribe(fetchTasks);

  async function fetchTasks(): Promise<void> {
    unsortedTasks = (await db.tasks.get($project)).filter((task) => !task.done);
    sortTasks();
  }

  onDestroy(() => db.tasks.unsubscribe(fetchTasks));

  // -- Functions -- \\
  function openCalendar(): void {
    modal.set(CalendarModal);
  }

  function openForm() {
    if (!$project) return alert($_("tasks.form.no-project"));
    expanded = !expanded;
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
      [$_("tasks.priority.high")]: [],
      [$_("tasks.priority.medium")]: [],
      [$_("tasks.priority.low")]: [],
      [$_("tasks.priority.no")]: [],
    };

    for (const task of unsortedTasks) {
      if (task.done != null) {
        continue;
      }

      if (task.priority == 3) {
        sorted[$_("tasks.priority.high")].push(task);
      } else if (task.priority == 2) {
        sorted[$_("tasks.priority.medium")].push(task);
      } else if (task.priority == 1) {
        sorted[$_("tasks.priority.low")].push(task);
      } else {
        sorted[$_("tasks.priority.no")].push(task);
      }
    }

    tasks = sorted;
  }

  function sortTasksDate() {
    let sorted = {
      [$_("tasks.date.overdue")]: [],
      [$_("tasks.date.day")]: [],
      [$_("tasks.date.week")]: [],
      [$_("tasks.date.long")]: [],
      [$_("tasks.date.someday")]: [],
    };

    for (const task of unsortedTasks) {
      if (task.done != null) {
        continue;
      }

      if (!task.due) {
        sorted[$_("tasks.date.someday")].push(task);
        continue;
      }

      const dateDiff = dateDiffInDays(new Date(), task.due);
      if (dateDiff < 0) {
        sorted[$_("tasks.date.overdue")].push(task);
      } else if (dateDiff == 0) {
        sorted[$_("tasks.date.day")].push(task);
      } else if (dateDiff > 7) {
        sorted[$_("tasks.date.long")].push(task);
      } else if (dateDiff > 0) {
        sorted[$_("tasks.date.week")].push(task);
      }
    }

    tasks = sorted;
  }

  async function addTask() {
    newTask.projectId = $project.id;

    await db.tasks.add(newTask);
    newTask = { name: "", priority: 0, due: null, projectId: null };
  }
</script>

<article class="task">
  <header>
    <div class="title-bar">
      <h1 class="is-marginless">{$_("tasks.name")}</h1>
      <div class="title-bar__actions">
        <button
          class="btn--icon [ is-paddingless ] [ material-icons ]"
          on:click={openCalendar}>history</button
        >
        <button class="btn--accent [ button primary ]" on:click={openForm}>
          {#if expanded}
            {$_("tasks.form.close")}
            <i class="material-icons">remove</i>
          {:else}
            {$_("tasks.form.new")}
            <i class="material-icons">add</i>
          {/if}
        </button>
      </div>
    </div>
    {#if expanded}
      <form class="task-form" class:expanded on:submit|preventDefault={addTask}>
        <div>
          <input
            name="name"
            placeholder={$_("tasks.form.name")}
            required
            bind:value={newTask.name}
          />
          <div class="row">
            <div class="picker col-5">
              <DatePicker placeholder={$_("tasks.form.due")} bind:date={newTask.due}  />
            </div>
            <select name="priorty" class="col-4" bind:value={newTask.priority}>
              <option value={0} class="text-grey" selected>
                {$_("tasks.priority.no")}
              </option>
              <option value={1}>
                {$_("tasks.priority.low")}
              </option>
              <option value={2}>
                {$_("tasks.priority.medium")}
              </option>
              <option value={3}>
                {$_("tasks.priority.high")}
              </option>
            </select>
            <button type="submit" class="col">
              {$_("tasks.form.add")}
            </button>    
          </div>
        </div>
      </form>
    {/if}
  </header>

  <label class="filter [ pull-right ]">
    <small>
      {$_("tasks.list.sort-by")}
    </small>
    <select bind:value={sortMethod} on:change={sortTasks}>
      <option value="d">
        {$_("tasks.list.date")}
      </option>
      <option value="p">
        {$_("tasks.list.priority")}
      </option>
    </select>
  </label>

  {#if !unsortedTasks.length}
    <span class="no-tasks">
      {$_("tasks.list.empty")}
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

  @media (max-width: 1600px) {
    .task {
      padding: 2rem 0 0;
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
    margin-left: 1rem;
    border-radius: 999px;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    .material-icons {
      font-size: 1.8rem;
    }
  }

  .task-form {
    button[type="submit"] {
      display: block;
      margin-top: 1rem;
      padding: 0;
    }

    input, select, .picker {
      background-color: white;
      margin-top: 1rem;
    }
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
    padding-top: 0.25rem;
    display: flex;
    align-items: baseline;
    white-space: nowrap;

    select {
      padding: 0.25rem !important;
      margin: 0 !important;
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
