<script lang="ts">
  import type { Link, LinkGroup, Task } from "@/lib/database/types";
  import * as db from "@/lib/database/LoveFieldModule";
  import { darkmode, modal, project } from "@/lib/store";
  import { _, locale, locales } from "svelte-i18n";

  import LinkGroupModal from "../modals/LinkGroupModal.svelte";
  import LinkModal from "../modals/LinkModal.svelte";
  import TaskModal from "../modals/TaskModal.svelte";
  import ProjectModal from "../modals/ProjectModal.svelte";

  let open = JSON.parse(localStorage.getItem("sidebar-open")) ?? false;
  let setURL = false;

  function toggleDarkMode() {
    $darkmode = !$darkmode;
    localStorage.setItem("darkmode", $darkmode.toString());
  }

  function toggleSideBar() {
    open = !open;
    localStorage.setItem("sidebar-open", open);
  }

  function switchLanguage() {
    const currentIdx = $locales.findIndex((l) => l == $locale);
    $locale = $locales[(currentIdx + 1) % $locales.length];
    localStorage.setItem("locale", $locale);
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
      (group as LinkGroup & { links: Link[] }).links = await db.links.get(
        group
      );
    }

    const data = {
      name: $project.name,
      linkgroups,
      tasks,
    };

    const date = new Date().toLocaleString("nl-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const filename = `${$project.name} - ${date}.json`;
    const file = new Blob([JSON.stringify(data, undefined, 2)], {
      type: "application/json",
    });

    // Save the file
    this.download = filename;
    this.href = window.URL.createObjectURL(file);
    this.dataset.downloadurl = ["text/json", this.download, this.href].join(
      ":"
    );
    setURL = true;

    this.click();
  }

  function importProject() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    reader.onload = async (readerEvent) => {
      var res = JSON.parse(readerEvent.target.result as string);
      if (
        !res ||
        !res.hasOwnProperty("name") ||
        !res.hasOwnProperty("linkgroups") ||
        !res.hasOwnProperty("tasks")
      ) {
        console.error("Not a valid file");
        return;
      }

      const proj = await db.projects.add({ name: res.name });
      for (const { name, links } of res.linkgroups) {
        const group = await db.linkgroups.add({ name, projectId: proj.id });

        for (const link of links as Link[]) {
          await db.links.add({
            name: link.name,
            url: link.url,
            groupId: group.id,
          });
        }
      }

      for (const task of res.tasks as Task[]) {
        task.projectId = proj.id;
        await db.tasks.add(task);
      }

      $project = proj;
    };
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

<div class="fab">
  <button class="fab-button" class:open on:click={toggleSideBar}>
    <i class="material-icons">settings</i>
  </button>

  <ul class="fab-buttons" class:open>
    <li class="fab-buttons__item">
      <button
        class="fab-buttons__link"
        data-tooltip={$_("sidebar.create.linkgroup")}
        on:click={newLinkGroup}
      >
        <i class="material-icons">post_add</i>
      </button>
    </li>
    <li class="fab-buttons__item">
      <button
        class="fab-buttons__link"
        data-tooltip={$_("sidebar.create.link")}
        on:click={newLink}
      >
        <i class="material-icons">bookmark_add</i>
      </button>
    </li>
    <li class="fab-buttons__item">
      <button
        class="fab-buttons__link"
        data-tooltip={$_("sidebar.create.task")}
        on:click={newTask}
      >
        <i class="material-icons">add_task</i>
      </button>
    </li>

    <li class="seperator" />

    <li class="fab-buttons__item">
      <button
        class="fab-buttons__link"
        data-tooltip={$_("sidebar.project.new")}
        on:click={newProject}
      >
        <i class="material-icons">library_add</i>
      </button>
    </li>
    <li class="fab-buttons__item">
      <button
        class="fab-buttons__link"
        data-tooltip={$_("sidebar.project.import")}
        on:click={importProject}
      >
        <i class="material-icons">file_upload</i>
      </button>
    </li>
    <li class="fab-buttons__item">
      <button
        class="fab-buttons__link"
        data-tooltip={$_("sidebar.project.export")}
        on:click={exportProject}
      >
        <i class="material-icons">file_download</i>
      </button>
    </li>

    <li class="seperator" />

    <li class="fab-buttons__item">
      <button
        class="fab-buttons__link"
        data-tooltip={$_("sidebar.darkmode")}
        on:click={toggleDarkMode}
      >
        <i class="material-icons"
          >{#if $darkmode} light_mode {:else} dark_mode {/if}</i
        >
      </button>
    </li>
    <li class="fab-buttons__item">
      <button
        class="fab-buttons__link"
        data-tooltip={$_("sidebar.language")}
        on:click={switchLanguage}
      >
        <i class="material-icons">translate</i>
      </button>
    </li>
  </ul>
</div>

<style lang="scss">
  .fab {
    position: fixed;
    top: 1.6rem;
    left: 1.6rem;
  }

  .fab-button {
    padding: 0 0 1.5rem 0;
    background: transparent;

    &.open {
      color: var(--color-primary);
    }
  }

  .fab-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    list-style: none;
    margin: 0;
    padding: 0;
    visibility: hidden;
    transition: 0.2s;

    &.open {
      visibility: visible;
    }
  }

  .fab-buttons__link {
    background-color: transparent;
    padding: 0;
  }

  [data-tooltip]::before {
    position: absolute;
    top: 50%;
    left: 100%;
    padding: 4px 7px;
    margin: 0px 12px;
    transform: translateY(-55%);

    font-weight: 600;
    white-space: nowrap;
    border-radius: 2px;
    color: var(--font-color);
    content: attr(data-tooltip);
    font-size: small;
    opacity: 0;

    transition: opacity 0.25s ease-in;
  }

  .fab-button.open:hover
    + .fab-buttons
    .fab-buttons__link[data-tooltip]::before,
  .fab-buttons__link:hover[data-tooltip]::before {
    opacity: 1;
  }

  .seperator {
    display: block;
    height: 0.25rem;
  }
</style>
