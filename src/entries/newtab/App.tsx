import { createMemo, createResource } from "solid-js";
import { createDefaultProject, getCurrentProject, getRoot, PROJECT_KEY } from "~/shared/js/bookmark";

import { Clock } from "~/components/clock/Clock";
import { Links } from "~/components/links/Links";
import { Projects } from "~/components/projects/Projects";
import { Tasks } from "~/components/tasks/Tasks";

import "modern-normalize/modern-normalize.css";
import "@phosphor-icons/web/fill";
import "@phosphor-icons/web/regular";

import "~/shared/css/base.css";
import "./App.css";

function App() {
  const [root] = createResource(getRoot);
  const [currentProject, { refetch: refetchCurrentProject }] = createResource(getCurrentProject);

  chrome.storage.local.onChanged.addListener(async (info) => {
    if (info[PROJECT_KEY]) {
      await refetchCurrentProject();
    }
  });

  chrome.bookmarks.onChanged.addListener(async (id) => {
    if (id == currentProject()?.id) {
      await refetchCurrentProject();
    }
  });

  createMemo(async () => {
    if (!root()) {
      return;
    }

    const projects = await chrome.bookmarks.getChildren(root()!.id).catch(() => {
      throw new Error(`Error fetching projects, root(id=${root()!.id}) not found.`);
    });

    if (projects.length === 0) {
      await createDefaultProject(root()!);
    }
  })

  return (
    <>
      <header id="header">
        <button id="open-settings" class="header__item clear" onClick={() => chrome.runtime.openOptionsPage()}>
          <i class="ph-fill ph-gear"></i>
        </button>
      </header>
      <main>
        <Clock />
        <Projects root={root} currentProject={currentProject} />

        <Links currentProject={currentProject} />
      </main>

      <aside class="sidebar">
        <Tasks currentProject={currentProject} />
        <section id="timer">
        </section>
      </aside>
    </>
  );
}

export default App;
