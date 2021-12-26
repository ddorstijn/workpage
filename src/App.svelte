<script lang="ts">
  import Fab from "./lib/Fab.svelte";
  import Clock from "./lib/Clock.svelte";
  import Links from "./lib/Links.svelte";
  import Modal from "./lib/modals/Modal.svelte";
  import Projects from "./lib/Projects.svelte";
  import Tasks from "./lib/Tasks.svelte";

  import { onMount } from "svelte";
  import { project } from "./store";
  import * as db from "./database/LoveFieldModule";

  import { saveAs } from 'file-saver';
  import type { Link, LinkGroup, Task } from "./database/database";

  let darkmode: boolean;

  let fileOutput: HTMLAnchorElement;
  let fileInput: HTMLInputElement;

  onMount(async () => {
    darkmode = JSON.parse(localStorage.getItem("darkmode")) ?? false;
    document.querySelector("body").classList.toggle('dark', darkmode);
  })

  function toggleTheme() {
    darkmode = !darkmode;
    document.querySelector("body").classList.toggle('dark', darkmode);
    localStorage.setItem("darkmode", darkmode.toString());
  }

  async function exportProject() {
    if (!$project) {
      console.error("No project is currently selected");
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
    fileOutput.download = filename;
    fileOutput.href = window.URL.createObjectURL(file);
    fileOutput.dataset.downloadurl = ["text/json", fileOutput.download, fileOutput.href].join(":");

    fileOutput.click();
  }

  function importProject() {
    var input = document.createElement('input');
    input.type = 'file';
    input.classList.add("is-hidden");

    input.onchange = e => { 
      var file = (e.target as HTMLFormElement).files[0]; 
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      reader.onload = async readerEvent => {
        var res = JSON.parse(readerEvent.target.result as string);
        console.log(res);
        if (!res || !res.hasOwnProperty('name') || !res.hasOwnProperty('linkgroups') || !res.hasOwnProperty('tasks')) {
          console.error("Not a valid file");
          return;
        }

        const proj = await db.projects.add({name: res.name});
        for (const {name, projectId, links} of res.linkgroups) {
          const group = await db.linkgroups.add({name, projectId});
          
          for (const {name, url} of links as Link[]) {
            await db.links.add({name, url, groupId: group.id});
          }
        }

        for (const task of res.tasks as Task[]) {
          task.projectId = proj.id;
          await db.tasks.add(task);
        }
      }
    }

    input.click();
  }
</script>

<ul id="settings">
  <li>
    <button id="theme-toggle" class="button icon" on:click={toggleTheme}>
      <i class="material-icons">
        {#if darkmode} light_mode {:else} dark_mode {/if}
      </i>
    </button>
  </li>
  <li>
    <button on:click={exportProject} class="button icon">
      <i class="material-icons">
        file_download
      </i>
    </button>
    <a bind:this={fileOutput} class="is-hidden" href="not-valid">
  </li>
  <li>
    <button on:click={importProject} class="button icon">
      <i class="material-icons">
        file_upload
      </i>
    </button>
    <input bind:this={fileInput} class="is-hidden">
  </li>
</ul>

<article class="newtab">
  <main>
    <Clock />
    <Projects />
    <Links />
  </main>
  <aside>
    <Tasks />
  </aside>
</article>

<Fab />
<Modal />

<style>
article.newtab {
	height: 100vh;
	width: 100vw;

	display: flex;
	background-color: var(--bg-secondary-color);
}

#settings {
  position: absolute;
  padding: 0;
  left: 0;
  top: 0;

  list-style: none;
}

#settings button {
  background-color: transparent;
}

main {
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

aside {
  width: 25vw;
}
</style>
