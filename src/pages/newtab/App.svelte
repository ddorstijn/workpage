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
  import type { Link, LinkGroup, Task } from "@/lib/database/types";
  
  onMount(async () => {
    if (!((await db.projects.get()).length) && !localStorage.getItem("toured")) {
      await storage.sync.clear();

      const json = {
        name: "General",
        linkgroups: [
          {
            name: "Google",
            links: [
              { name: 'Google search', url: 'https://www.google.com' },
              { name: 'Gmail', url: 'https://www.gmail.com' },
              { name: 'Drive', url: 'https://drive.google.com' }
            ]
          },
          {
            name: "Social",
            links: [
              { name: 'Youtube', url: 'https://www.youtube.com' },
              { name: 'Reddit', url: 'https://www.reddit.com' },
              { name: 'Twitter', url: 'https://www.twitter.com' }
            ]
          },
        ],
        tasks: [
          { name: 'Explore Workpage', due: new Date() }
        ]
      };

      $project = await db.projects.add({ name: json.name }); 
      for (const linkgroup of json.linkgroups) {
        let group = await db.linkgroups.add({ name: linkgroup.name, projectId: $project.id });

        for (const link of linkgroup.links as Link[]) {
          await db.links.add({
            name: link.name,
            url: link.url,
            groupId: group.id,
          });
        }
      }

      for (const task of json.tasks as Task[]) {
        task.projectId = $project.id;
        await db.tasks.add(task);
      }

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
