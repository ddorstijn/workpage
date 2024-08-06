import { Component, createResource, For } from "solid-js";
import { getCurrentProject, recursiveDeleteBookmarks } from "../util";
import { Bookmarks, bookmarks, storage } from "webextension-polyfill";

export const Workpage: Component = () => {
    const [root] = createResource(async () => {
        const roots = await bookmarks.search({ title: "Workpage" });
        if (roots.length === 0) {
            await bookmarks.create({ title: "Workpage" });

            // TODO: create default project
        }

        if (roots.length > 1) {
            alert("Error fetching projects: Too many bookmark folders named 'Workpage'. Please delete the one that is not needed.");
            return;
        }

        return roots[0];
    });

    const [projects, { refetch: refetchProjects }] = createResource(root, async () => {
        return await bookmarks.getChildren(root()!.id);
    });

    const [currentProject, { refetch: refetchCurrent }] = createResource(getCurrentProject);

    async function setCurrentProject(project: Bookmarks.BookmarkTreeNode | null) {
        await storage.local.set({ currentProjectId: project?.id });
        await refetchCurrent();
    }

    async function deleteProject(project: Bookmarks.BookmarkTreeNode) {
        await recursiveDeleteBookmarks(project);
        await refetchProjects();

        if (currentProject()?.id === project.id) {
            await setCurrentProject(null);
        }
    }

    async function addProject() {
        const title = prompt("What is the project name?")

        if (!title) {
            return;
        }

        const index = projects()!.map(({ index }) => index ?? 0).reduce((prev, cur) => {
            return prev > cur ? prev : cur;
        }, 0);

        await bookmarks.create({ title, parentId: root()!.id, index });
        await refetchProjects();
    }

    async function addGroup() {
        if (!currentProject()) {
            return;
        }

        const title = prompt("What is the group name?");
        if (!title) {
            return;
        }

        await bookmarks.create({ title, parentId: currentProject()!.id });
        await refetchCurrent();
    }

    async function deleteGroup(group: Bookmarks.BookmarkTreeNode) {
        await recursiveDeleteBookmarks(group);
        await refetchCurrent();
    }

    async function addLink(groupId: string) {
        await bookmarks.create({ title: "Link", url: "https://google.com", parentId: groupId });
        await refetchCurrent();
    }

    async function deleteLink(link: Bookmarks.BookmarkTreeNode) {
        await bookmarks.remove(link.id);
        await refetchCurrent();
    }

    return (
        <div>
            <h1>Workpage</h1>
            <button onClick={addProject}>Add Project</button>
            <button onClick={addGroup}>Add group</button>
            <span>{currentProject() ? `Current project: ${currentProject()!.title}` : ""}</span>
            <h2>Projects</h2>
            <ol>
                <For each={projects()}>
                    {(project) =>
                        <li>
                            <button onClick={() => setCurrentProject(project)}>
                                {project.title}
                                {currentProject()?.id === project.id ? "(current)" : ""}
                            </button>
                            <button onClick={() => deleteProject(project)}>Delete</button>
                        </li>
                    }
                </For>
            </ol>

            <ol>
                <For each={currentProject()?.children}>
                    {(group) =>
                        <li>
                            <h3>{group.title}</h3>
                            <button onClick={() => addLink(group.id)}>Add link</button>
                            <button onClick={() => deleteGroup(group)}>Delete</button>
                            <ol>
                                <For each={group.children}>
                                    {(link) =>
                                        <li>
                                            <a href={link.url}>{link.title}</a>
                                            <button onClick={() => deleteLink(link)}>Delete</button>
                                        </li>
                                    }
                                </For>
                            </ol>
                        </li>
                    }
                </For>
            </ol>
        </div>
    );
}