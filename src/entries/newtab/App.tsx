import { createEffect, createResource } from "solid-js";
import { createDefaultProject, getCurrentProject, getRoot, PROJECT_KEY } from "~/shared/js/bookmark";
import { DEFAULT_SETTINGS } from "~/shared/js/settings";

import { Clock } from "~/components/clock/Clock";
import { Links } from "~/components/links/Links";
import { Projects } from "~/components/projects/Projects";
import { Tasks } from "~/components/tasks/Tasks";
import { Timer } from "~/components/timer/Timer";

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

  createEffect(async () => {
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

  const [settings, { refetch: refetchSettings }] = createResource(async () => {
    const settings = (await chrome.storage.sync.get("settings"))["settings"] as typeof DEFAULT_SETTINGS | undefined;
    if (!settings) {
      return DEFAULT_SETTINGS;
    }

    return settings;
  });

  createEffect(async () => {
    if (!settings()) {
      return;
    }

    for (const [key, value] of Object.entries(settings()!)) {
      document.documentElement.style.setProperty(`--${key}`, value);
    }
  })

  chrome.storage.sync.onChanged.addListener(async (info) => {
    if (info.settings) {
      await refetchSettings();
    }
  });

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
        <Timer currentProject={currentProject} />
      </aside>
    </>
  );
}

export default App;
