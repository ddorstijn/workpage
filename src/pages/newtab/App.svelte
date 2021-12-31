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
    if (!(await db.projects.get()).length && !localStorage.getItem("toured")) {
      localStorage.setItem("toured", "true");

      const json = {
        projects: [
          {
            id: "ExampleProject",
            name: "General",
            used: "2021-12-29T22:30:31.399Z",
          },
        ],
        linkgroups: [
          {
            id: "ExampleLinkGroupGoogle",
            name: "Google",
            projectId: "ExampleProject",
          },
          {
            id: "ExampleLinkGroupSocial",
            name: "Social",
            projectId: "ExampleProject",
          },
        ],
        links: [
          {
            id: "ExampleLinkSearch",
            name: "Search",
            url: "https://www.google.com",
            groupId: "ExampleLinkGroupGoogle",
          },
          {
            id: "ExampleLinkGmal",
            name: "Gmail",
            url: "https://www.gmail.com",
            groupId: "ExampleLinkGroupGoogle",
          },
          {
            id: "ExampleLinkDrive",
            name: "Drive",
            url: "https://drive.google.com",
            groupId: "ExampleLinkGroupGoogle",
          },
          {
            id: "ExampleLinkYoutube",
            name: "Youtube",
            url: "https://youtube.com",
            groupId: "ExampleLinkGroupSocial",
          },
          {
            id: "ExampleLinkTwitter",
            name: "Twitter",
            url: "https://twitter.com",
            groupId: "ExampleLinkGroupSocial",
          },
          {
            id: "ExampleLinkReddit",
            name: "Reddit",
            url: "https://reddit.com",
            groupId: "ExampleLinkGroupSocial",
          },
        ],
        tasks: [
          {
            id: "ExampleTaskExplore",
            name: "Explore Workpage!",
            priority: 3,
            due: "2021-12-28T23:00:00.000Z",
            projectId: "ExampleProject",
          },
        ],
      };

      await storage.sync.set(json);
      $project = (await storage.sync.get("projects"))["projects"][0];

      $modal = TourModal;
    }
  });
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
