<script lang="ts">
  import TaskItem from "./list-items/TaskItem.svelte";
  import CalendarModal from "./modals/CalendarModal.svelte";

  import Database from "../database/LoveField";
  import type { Task } from "src/database/database";
  
  import { modal } from "../store";
  import { onDestroy, onMount } from "svelte";

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  
  interface ISortedTasks {
    "Overdue": Task[],
    "Today": Task[],
    "This week": Task[],
    "Long term": Task[],
    "Someday": Task[]
  }

  // -- Members -- \\
  let db: Database;
  let tasks: ISortedTasks = {
    "Overdue": [],
    "Today": [],
    "This week": [],
    "Long term": [],
    "Someday": []
  };

  onMount(async () => {
    db = await Database.getInstance();
    db.tasks.subscribe(callback);
  });

  onDestroy(() => db.tasks.unsubscribe(callback));

  function callback(data: Task[]): void {
      tasks = sortTasks(data);
  }

  // -- Functions -- \\
  function openCalendar(): void {
    modal.set(CalendarModal);
  }

  function dateDiffInDays(a: Date, b: Date): number {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  function sortTasks(tasks: Task[]) {
    let sorted: ISortedTasks = {
      "Overdue": [],
      "Today": [],
      "This week": [],
      "Long term": [],
      "Someday": []
    };

    for (const task of tasks) {
      if (!task.due) {
        sorted["Someday"].push(task);  
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
</script>

<article>
  <header>
    <h1>Tasks</h1>
    <button class="btn-calendar [ button clear icon-only ] material-icons" on:click={openCalendar}>event</button>
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

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--color-lightGrey);
  }

  header * {
    margin: 0;
    padding: 0;
  }
  
  header .btn-calendar {
    font-size: 2rem;
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
