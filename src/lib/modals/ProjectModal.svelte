<script lang="ts">
  import { editRef, modal, project as projectStore } from "../../store";
  import * as db from "../../database/LoveFieldModule";
  import type { Project } from "src/database/database";

  let project: Project = { name: '' };

  async function addProject(): Promise<void> {
    const newProject = await db.projects.add(project);
    $projectStore = newProject;
    
    $editRef = null;
    $modal = null;
  }
</script>

<header>Project</header>
<div>
  <form on:submit|preventDefault={addProject}>
    <input placeholder="Project name" bind:value={project.name} required>
    <button type="submit">Save project</button>
  </form>
</div>

<style>
  header {
    text-align: center;
    font-weight: bolder;
    margin-bottom: 2rem;
  }

  button {
    display: block;
    margin: 2rem auto 0;
  }
</style>