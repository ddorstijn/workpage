<script lang="ts">
  import { darkmode, modal, project } from "../../store";

  import type { Link, LinkGroup, Task } from "src/database/database";
  import * as db from "../../database/LoveFieldModule";
  import LinkGroupModal from "../modals/LinkGroupModal.svelte";
  import LinkModal from "../modals/LinkModal.svelte";
  import TaskModal from "../modals/TaskModal.svelte";
  import ProjectModal from "../modals/ProjectModal.svelte";

  let setURL = false;

  function toggleTheme() {
    $darkmode = !$darkmode;
    localStorage.setItem("darkmode", $darkmode.toString());
  }

  async function exportProject(e: MouseEvent) {
    if (!$project) {
      console.error("No project is currently selected");
      return;
    }

    // Trick to set href and trigger download
    if (!setURL) {
      e.preventDefault();
    } else {
      setURL = false;
      return;
    }

    const tasks = await db.tasks.get($project);
    const linkgroups = await db.linkgroups.get($project);
    for (const group of linkgroups) {
      (group as LinkGroup & { links: Link[]}).links = await db.links.get(group);
    }

    const data = {
      name: $project.name,
      linkgroups,
      tasks
    }

    const date = new Date().toLocaleString("nl-US", {year: "numeric", month: "numeric", day: "numeric"});
    const filename = `${$project.name} - ${date}.json`;
    const file = new Blob([JSON.stringify(data, undefined, 2)], { type: 'application/json' });

    // Save the file
    this.download = filename;
    this.href = window.URL.createObjectURL(file);
    this.dataset.downloadurl = ["text/json", this.download, this.href].join(":");
    setURL = true;

    this.click();
  }

  function importProject() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    reader.onload = async readerEvent => {
      var res = JSON.parse(readerEvent.target.result as string);
      if (!res || !res.hasOwnProperty('name') || !res.hasOwnProperty('linkgroups') || !res.hasOwnProperty('tasks')) {
        console.error("Not a valid file");
        return;
      }

      const proj = await db.projects.add({name: res.name});
      for (const {name, links} of res.linkgroups) {
        const group = await db.linkgroups.add({name, projectId: proj.id});
        
        for (const link of links as Link[]) {
          await db.links.add({name: link.name, url: link.url, groupId: group.id});
        }
      }

      for (const task of res.tasks as Task[]) {
        task.projectId = proj.id;
        await db.tasks.add(task);
      }
    }
  }
  
  function newProject() {
    modal.set(ProjectModal);
  }
  
  function newLinkGroup() {
    modal.set(LinkGroupModal);
  }
  
  function newLink() {
    modal.set(LinkModal);
  }

  function newTask() {
    modal.set(TaskModal);
  }
</script>

<ul class="settings">
  <li>
    <button class="button icon" on:click={toggleTheme}>
      <i class="material-icons">
        {#if $darkmode} light_mode {:else} dark_mode {/if}
      </i>
    </button>
  </li>

  <li>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="button icon" on:click={exportProject}>
      <i class="material-icons"> file_download </i>
    </a>
  </li>
  <li>
    <label class="button icon">
      <input type="file" class="is-hidden" on:change={importProject} />
      <i class="material-icons"> file_upload </i>
    </label>
  </li>

  <li>
    <button class="button icon" on:click={newProject}>
      <i class="material-icons">
        library_add
      </i>
    </button>
  </li>

  <li>
    <button class="button icon" on:click={newLinkGroup}>
      <i class="material-icons">
        create_new_folder
      </i>
    </button>
  </li>

  <li>
    <button class="button icon" on:click={newLink}>
      <i class="material-icons">
        add_link
      </i>
    </button>
  </li>

  <li>
    <button class="button icon" on:click={newTask}>
      <i class="material-icons">
        note_add
      </i>
    </button>
  </li>
</ul>

<style>
  .settings {
    position: absolute;
    padding: 0;
    left: 0;
    top: 0;

    list-style: none;
  }

  .settings .button {
    background-color: transparent;
  }
</style>