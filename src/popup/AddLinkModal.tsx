import { Component, createResource, For } from "solid-js";
import { getCurrentProject } from "../util";
import { bookmarks, tabs } from "webextension-polyfill";

export const AddLinkModal: Component = () => {
  const [currentProject] = createResource(getCurrentProject);

  const [activeTab] = createResource(async () => {
    const activeTabs = await tabs.query({ active: true, currentWindow: true });
    return activeTabs[0];
  });

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const parentId = formData.get("group") as string;

    await bookmarks.create({ title, url, parentId });
    window.close();
  }

  return (
    <div>
      <h1>{currentProject()?.title}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Title</span>
          <input name="title" type="text" value={activeTab()?.title} />
        </label>
        <label>
          <span>URL</span>
          <input name="url" type="url" value={activeTab()?.url} />
        </label>
        <label>
          <span>Group</span>
          <select name="group">
            <For each={currentProject()?.children}>
              {(group) =>
                <option value={group.id}>
                  {group.title}
                </option>}
            </For>
          </select>
        </label>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}