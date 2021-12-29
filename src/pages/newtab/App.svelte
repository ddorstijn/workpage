<script lang="ts">
  import Clock from "@/components/Clock.svelte";
  import Links from "@/components/Links.svelte";
  import Projects from "@/components/Projects.svelte";
  import Sidebar from "@/components/menu/Sidebar.svelte";
  import Tasks from "@/components/Tasks.svelte";
  
  import Modal from "@/components/modals/Modal.svelte";
  import TourModal from "@/components/modals/TourModal.svelte";

  import { darkmode, db, modal, project } from "@/lib/store";
  import { storage } from "webextension-polyfill";
  import { onMount } from "svelte";
  
  onMount(async () => {
    if (!((await db.projects.get()).length) && !localStorage.getItem("toured")) {
      const json = {
        "projects": [
          {
            "name": "General",
            "id": "8adefd01-e1a8-434a-b9a7-089746ab46d1",
            "used": "2021-12-29T22:30:31.399Z"
          }
        ],
        "linkgroups": [
          {
            "name": "Google",
            "projectId": "8adefd01-e1a8-434a-b9a7-089746ab46d1",
            "id": "e61169ae-a0a4-474b-8675-8a5ab5e8624e"
          },
          {
            "name": "Social",
            "projectId": "8adefd01-e1a8-434a-b9a7-089746ab46d1",
            "id": "da866eda-a18c-496d-9a9c-869d79453562"
          }
        ],
        "links": [
          {
            "name": "Search",
            "url": "https://www.google.com",
            "groupId": "e61169ae-a0a4-474b-8675-8a5ab5e8624e",
            "id": "0d100eac-a333-4c60-8e14-f6484bf73d79"
          },
          {
            "name": "Gmail",
            "url": "https://www.gmail.com",
            "groupId": "e61169ae-a0a4-474b-8675-8a5ab5e8624e",
            "id": "b18c79d8-1cc0-4d05-a18f-d202f1a854f4"
          },
          {
            "name": "Drive",
            "url": "https://drive.google.com",
            "groupId": "e61169ae-a0a4-474b-8675-8a5ab5e8624e",
            "id": "81d0715d-fb22-4ffe-8a55-baed8ae35c8d"
          },
          {
            "name": "Youtube",
            "url": "https://youtube.com",
            "groupId": "da866eda-a18c-496d-9a9c-869d79453562",
            "id": "81d0715d-fb22-4ffe-8a55-baed8ae35c8d"
          },
          {
            "name": "Twitter",
            "url": "https://twitter.com",
            "groupId": "da866eda-a18c-496d-9a9c-869d79453562",
            "id": "81d0715d-fb22-4ffe-8a55-baed8ae35c8d"
          },
          {
            "name": "Reddit",
            "url": "https://reddit.com",
            "groupId": "da866eda-a18c-496d-9a9c-869d79453562",
            "id": "81d0715d-fb22-4ffe-8a55-baed8ae35c8d"
          }
        ],
        "tasks": [
          {
            "name": "Explore Workpage!",
            "priority": 3,
            "due": "2021-12-28T23:00:00.000Z",
            "id": "06fd1f34-4672-414a-a3d0-45448db63925"
          }
        ]
      };

      await storage.sync.set(json);
      $project = (await storage.sync.get("projects"))["projects"][0];

      $modal = TourModal;
    }
  })
</script>

<article class="newtab" class:darkmode={$darkmode}>
  <Sidebar />

  <main>
    <Clock />
    <Projects />
    <Links />
  </main>
  <aside>
    <Tasks />
  </aside>

  <Modal />
</article>

<style lang="scss">
  article.newtab {
    --bg-color: #ffffff;
    --bg-secondary-color: #f3f3f6;
    --color-primary: #14854f;
    --color-lightGrey: #d2d6dd;
    --color-grey: #747681;
    --color-darkGrey: #3f4144;
    --color-error: #d43939;
    --color-success: #28bd14;
    --grid-maxWidth: 120rem;
    --grid-gutter: 2rem;
    --font-size: 1.6rem;
    --font-color: #333333;
    --font-family-sans: "Inter", sans-serif;
    --font-family-mono: monaco, "Consolas", "Lucida Console", monospace;

    height: 100vh;
    width: 100vw;

    display: flex;
    background-color: var(--bg-secondary-color);

    &.darkmode {
      filter: invert(100%);
    }
  }

  main {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  aside {
    width: 25vw;
  }
</style>
