<script lang="ts">
  import CalendarModal from "./modals/CalendarModal.svelte";
  import TaskItem from "./list-items/TaskItem.svelte";

  import { modal, project } from "../store";
  import { onDestroy, onMount } from "svelte";
  import type { Project, Task } from "src/database/database";
  import * as db from "../database/LoveFieldModule";

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  interface ISortedTasks {
    "Overdue": Task[],
    "Today": Task[],
    "This week": Task[],
    "Long term": Task[],
    "Someday": Task[]
  }
  
  // -- Members -- \\
  let expanded = false;
  let tasks: ISortedTasks = {
    "Overdue": [],
    "Today": [],
    "This week": [],
    "Long term": [],
    "Someday": []
  };

  onMount(async () => {
      tasks = sortTasks(await db.tasks.get($project));
      db.tasks.subscribe(callback);
  });

  onDestroy(() => db.tasks.unsubscribe(callback));

  async function callback(task: Task): Promise<void> {
    tasks = sortTasks(await db.tasks.get($project));
  }

  project.subscribe(async (newProject: Project) => {
    if (!newProject) {
      tasks = sortTasks([]);
      return;
    }

    tasks = sortTasks(await db.tasks.get(newProject));
  })

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

  function sortTasks(unsortedTasks: Task[]) {
    let sorted = {
      "Overdue": [],
      "Today": [],
      "This week": [],
      "Long term": [],
      "Someday": []
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

    return sorted;
  }

  function addTask() {
    const name = this.querySelector('input[type="text"]').value;
    const due = this.querySelector('input[type="date"]').value;

    console.log(name, due);
  }
</script>

<article>
  <header class="task-header">
    <div class="task-title">
      <h1 class="is-marginless">Tasks</h1>
      <div class="task-title-actions">
        <button class="btn-calendar [ button ] material-icons" on:click={openCalendar}>event</button>
        <button id="add-task-btn" class="button icon primary" on:click={() => expanded = !expanded}>
          {#if expanded}
            Close
            <i class="material-icons">remove</i>        
          {:else}
            New
            <i class="material-icons">add</i>
          {/if}
        </button>
      </div>
    </div>
    {#if expanded}
      <form class="task-form row" on:submit|preventDefault={addTask}>
        <div class="col">
          <input type="text" placeholder="Task name" required />
          <input type="date" />
        </div>
        <button class="button clear" type="submit">Add</button>
      </form>
    {/if}
  </header>

  {#each Object.entries(tasks) as [name, items]}
    {#if items.length}
      <details open>
        <summary class="date-tag button icon">
          {name}
          <i class="material-icons details-icon">expand_less</i>
        </summary>
        <ul id="task__list">
          {#each items as task}
            <TaskItem {task} />
          {/each}
        </ul>
      </details>
    {/if}
  {/each}
</article>

<style>
  article {
    margin: 2rem;
    padding: 2rem;
    box-shadow: none;
  }

  .task-header {
    border-bottom: 1px solid var(--color-lightGrey);
  }

  .task-header .task-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .task-title-actions {
    display: flex;
    align-items: center;
  }
  
  .btn-calendar {
    background-color: transparent;
    padding: 0;
    font-size: 1.8rem;
  }

  #add-task-btn {
    padding: 0.5rem 1rem;
    border-radius: 999px;
    font-size: 1.4rem;
    gap: .5rem;
  }

  #add-task-btn .material-icons {
    font-size: 1.8rem;
  }

  .task-form input {
    margin-top: 1rem;
  }

  #task__list {
    padding: 0 1.5rem;
    margin: 0;
    list-style: none;
    
    max-height: 50vh;
    overflow-y: auto;
  }

  details {
    margin-top: 1rem;
  }

  details + details {
    margin-top: 1rem;
  }

  .details-icon {
    transition: transform 0.25s ease-out;
  }

  details[open] .details-icon {
    transform: rotateX(180deg);
  }

  .date-tag {
    padding: 0;
    margin-left: 1rem;
    font-size: 1.4rem;
    font-weight: 500;
    white-space: nowrap;
    background-color: transparent;
    color: var(--color-grey);
  }
</style>
