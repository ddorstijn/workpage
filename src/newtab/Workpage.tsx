import { Component, createResource, For } from "solid-js";
import { bookmarks } from "webextension-polyfill";

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

    const [projects, { refetch }] = createResource(root, async () => {
        return (await bookmarks.getChildren(root()!.id)).sort((a, b) => {
            if (!a.index || !b.index) {
                return 0;
            }

            return a.index - b.index;
        });
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
        await refetch();
    }

    return (
        <div>
            <h1>Workpage</h1>
            <button onClick={addProject}>Add Project</button>
            <ol>
                <For each={projects()}>
                    {(project) => <li>{project.title}</li>}
                </For>
            </ol>
        </div>
    );
}