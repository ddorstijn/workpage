<script lang="ts">
  import { editRef, modal, project } from "../../store";
  import * as db from "../../database/LoveFieldModule";
  import type { Project } from "src/database/database";

  let project: Project = { name: '' };

  function addProject(): void {
    db.projects.add(project);
    
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