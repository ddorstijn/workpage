import { createMemo, createResource, For } from "solid-js";
import { getCurrentProject, getRoot, PROJECT_KEY } from "~/shared/js/bookmark";

import { Projects } from "~/components/projects/Projects";

import "modern-normalize/modern-normalize.css";
import "@phosphor-icons/web/fill";
import "@phosphor-icons/web/regular";

import "~/shared/css/base.css";
import "./App.css";

function App() {
  const [root] = createResource(getRoot);
  const [currentProject, { refetch: refetchCurrentProject }] = createResource(getCurrentProject);
  const [groups, { refetch: refetchGroups }] = createResource(async () => {
    if (!currentProject()) {
      return [];
    }

    return await chrome.bookmarks.getChildren(currentProject()!.id);
  })

  const [tab] = createResource(async () => (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0]);

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
    if (!currentProject()) {
      return;
    }

    await refetchGroups();
  });

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

  async function add(event: SubmitEvent) {
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const title = data.get('title') as string;
    const url = data.get('url') as string;

    let group = data.get('group') as string;
    if (group === 'new') {
      group = (await chrome.bookmarks.create({
        title: data.get('group-name') as string,
        parentId: currentProject()?.id,
      })).id;
    }

    await chrome.bookmarks.create({
      title: title,
      url: url,
      parentId: group,
    });

    window.close();
  }

  function newGroup(event: Event) {
    const select = event.target as HTMLSelectElement;
    if (select.value === 'new') {
      document.getElementById('group-name')?.classList.remove('hidden');
      return;
    }

    document.getElementById('group-name')?.classList.add('hidden');
  }

  return (
    <>
      <h1>Workpage</h1>
      <Projects root={root} currentProject={currentProject} />
      <section>
        Timer
      </section>
      <section id="add-link">
        <h2>Add link</h2>
        <form onSubmit={add}>
          <div class="group-select">
            <label>
              <span>Group</span>
              <select id="group" name="group" required onChange={newGroup}>
                <For each={groups()}>
                  {(group, idx) => <option value={group.id} selected={idx() == 0}>{group.title}</option>}
                </For>
                <option value="new">-- new group --</option>
              </select>
            </label>

            <label id="group-name" class="hidden">
              <span>Group name</span>
              <input name="group-name" type="text" />
            </label>
          </div>
          <label>
            <span>Title</span>
            <input name="title" type="text" value={tab()?.title} required />
          </label>
          <label>
            <span>URL</span>
            <input name="url" type="url" value={tab()?.url} required />
          </label>

          <button type="submit">Add</button>
        </form>
      </section>
    </>
  );
}

export default App;
