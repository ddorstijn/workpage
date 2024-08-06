import { Component, createResource, createSignal, For } from "solid-js";
import { Bookmarks, bookmarks, storage } from "webextension-polyfill";

export const Workpage: Component = () => {
    const [root] = createResource(async () => {
        const roots = await bookmarks.search({ title: "Workpage" });
        if (root.length === 0) {
            await bookmarks.create({ title: "Workpage" });

            // TODO: create default project
        }

        if (root.length > 1) {
            alert("Error fetching projects: Too many bookmark folders named 'Workpage'. Please delete the one that is not needed.");
            return;
        }

        return roots[0];
    });

    const [projects, { refetch: refetchProjects }] = createResource(root, async () => {
        return (await bookmarks.getChildren(root()!.id)).sort((a, b) => {
            if (!a.index || !b.index) {
                return 0;
            }

            return a.index - b.index;
        });
    });

    const [currentProject, { refetch: refetchCurrent }] = createResource(async () => {
        const record = await storage.local.get("currentProject");
        return record.currentProject as Bookmarks.BookmarkTreeNode | undefined;
    });

    async function setCurrentProject(project: Bookmarks.BookmarkTreeNode) {
        await storage.local.set({ currentProject: project });
        refetchCurrent();
    }

    async function deleteProject(project: Bookmarks.BookmarkTreeNode) {
        await bookmarks.remove(project.id);
        await refetchProjects();
    }

    const [groups, { refetch: refetchGroups }] = createResource(currentProject, async (project) => {
        return await bookmarks.getChildren(project!.id);
    });

    async function addProject() {
        const title = prompt("What is the project name?")
        if (!title) {
            return;
        }

        const index = projects()!.map(({ index }) => index ?? 0).reduce((prev, cur) => {
            return prev > cur ? prev : cur;
        });

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
        await refetchGroups();
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
                <For each={groups()}>
                    {(group) =>
                        <li>
                            {group.title}
                        </li>
                    }
                </For>
            </ol>
        </div>
    );
}