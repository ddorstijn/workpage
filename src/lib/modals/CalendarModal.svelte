<script lang="ts">
  import TaskItem from "../list-items/TaskItem.svelte";

  import { modal, project } from "../../store";
  import { onDestroy, onMount } from "svelte";
  import type { Project, Task } from "src/database/database";
  import * as db from "../../database/LoveFieldModule";

  // -- Members -- \\
  let tasks: Task[] = [];

  onMount(async () => {
      tasks = await db.tasks.get($project);
      db.tasks.subscribe(callback);
  });

  onDestroy(() => db.tasks.unsubscribe(callback));

  async function callback(task: Task): Promise<void> {
    tasks = await db.tasks.get($project);
  }

  project.subscribe(async (newProject: Project) => {
    if (!newProject) {
      tasks = [];
      return;
    }

    tasks = await db.tasks.get(newProject);
  })
</script>

<header>
  <h1 class="is-marginless">Task history</h1>
</header>
<ul class="task-list">
  {#each tasks as task}
    {#if task.done}
      <TaskItem {task} />
    {/if}
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
</style>