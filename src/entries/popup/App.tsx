import { createResource } from "solid-js";
import { getCurrentProject, getRoot, PROJECT_KEY } from "~/shared/js/bookmark";

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

  return (
    <>
      <h1>Workpage</h1>
      <Projects root={root} currentProject={currentProject} />
      <Timer currentProject={currentProject} />
      <LinkAdd currentProject={currentProject} />
    </>
  );
}

export default App;
