<script lang="ts">
  import TaskItem from "../list-items/TaskItem.svelte";

  import { modal, project } from "../../store";
  import { onDestroy, onMount } from "svelte";
  import type { Project, Task } from "src/database/database";
  import * as db from "../../database/LoveFieldModule";


  // -- Members -- \\
  let tasks: Task[] = [];

  onMount(async () => {
      tasks = await db.tasks.get($project?.id as number);
      db.tasks.subscribe(callback);
  });

  onDestroy(() => db.tasks.unsubscribe(callback));

  function callback(data: Task[]): void {
    tasks = data;
  }

  project.subscribe(async (newProject: Project) => {
    if (!newProject) {
      tasks = [];
      return;
    }

    tasks = await db.tasks.get(newProject.id as number);
  })
</script>

<header>
  <h1 class="is-marginless">Task history</h1>
</header>
<div>
  {#each tasks as task}
    {#if task.done}
      <TaskItem {task} />
    {/if}
  {/each}
</div>

<style>
  
</style>