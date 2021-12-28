<script lang="ts">
  import TaskItem from "../list-items/TaskItem.svelte";

  import { project } from "@/lib/store";
  import { onDestroy, onMount } from "svelte";
  import type { Task } from "@/lib/database/types";
  import * as db from "@/lib/database/LoveFieldModule";
  import { _ } from "svelte-i18n";

  // -- Members -- \\
  let tasks: Task[] = [];

  onMount(async () => {
    fetchTasks();
    db.tasks.subscribe(fetchTasks);
  });
  
  project.subscribe(fetchTasks);

  async function fetchTasks(): Promise<void> {
    tasks = (await db.tasks.get($project)).filter(t => t.done);
  }
  
  onDestroy(() => db.tasks.unsubscribe(fetchTasks));
</script>

<header>
  <h1 class="text-center">{$_("tasks.history.name")}</h1>
</header>

{#if !tasks.length}
  <span class="empty text-grey">{$_("tasks.history.empty")}</span>
{/if}

<ul class="task-list">
  {#each tasks as task}
    <TaskItem {task} />
  {/each}
</ul>

<style>
  .task-list {
    list-style: none;
    padding: 0;
    margin: 0;

    width: 20vw;
    min-width: 300px;
  }

  .empty {
    font-size: small;
    width: 100%;
    text-align: center;
    display: block;
    margin-top: 2rem;
  }
</style>
