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

    return (
        <div>
            <h1>Workpage</h1>
            <button onClick={addProject}>Add Project</button>
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
                        </li>}
                </For>
            </ol>
        </div>
    );
}