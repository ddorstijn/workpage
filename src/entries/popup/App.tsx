import { createEffect, createResource } from "solid-js";
import { getCurrentProject, getRoot, PROJECT_KEY } from "~/shared/js/bookmark";
import { DEFAULT_SETTINGS } from "~/shared/js/settings";

import { Projects } from "~/components/projects/Projects";
import { Timer } from "~/components/timer/Timer";
import { LinkAdd } from "~/components/links/LinkAdd";

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
      <header>
        <h1>Workpage</h1>
      </header>
      <Projects root={root} currentProject={currentProject} />
      <Timer currentProject={currentProject} />
      <LinkAdd currentProject={currentProject} />
    </>
  );
}

export default App;
