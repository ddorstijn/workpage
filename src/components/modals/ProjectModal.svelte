<script lang="ts">
  import { db, editRef, modal, project as projectStore } from "@/lib/store";
  import type { Project } from "@/lib/database/types";
  import { _ } from "svelte-i18n";

  let project: Project = { name: "" };

  async function addProject(): Promise<void> {
    const newProject = await db.projects.add(project);
    $projectStore = newProject;

    $editRef = null;
    $modal = null;
  }
</script>

<header>{$_("projects.name")}</header>
<div>
  <form on:submit|preventDefault={addProject}>
    <input
      placeholder={$_("projects.form.name")}
      bind:value={project.name}
      required
    />
    <button type="submit">{$_("projects.form.save")}</button>
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
