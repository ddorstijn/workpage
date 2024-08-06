import { Component, createResource, For } from "solid-js";
import { bookmarks } from "webextension-polyfill";

export const Workpage: Component = () => {
    const [projects] = createResource(async () => {
        const root = await bookmarks.search({ title: "Workpage" });

        if (root.length === 0) {
            await bookmarks.create({ title: "Workpage" });

            // TODO: create default project
        }

        if (root.length > 1) {
            alert("Error fetching projects: Too many bookmark folders named 'Workpage'. Please delete the one that is not needed.");
            return;
        }

        return await bookmarks.getChildren(root[0].id);
    });

    async function addProject() {
        const title = prompt("What is the project name?")
        if (!title) {
            return;
        }

        const parentId = (await bookmarks.search({ title: 'Workpage' }))[0].id;
        bookmarks.create({ title, parentId });
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