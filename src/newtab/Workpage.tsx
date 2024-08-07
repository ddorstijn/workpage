import { Component, createResource, For } from "solid-js";
import { getCurrentProject } from "../util";
import { bookmarks } from "webextension-polyfill";
import { Tasks } from "./Tasks";
import { LinkGroup } from "./LinkGroup";
import { Clock } from "./Clock";
import { Header } from "./Header";
import { Projects } from "./Projects";

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

    const [projects, { refetch: refetchProjects }] = createResource(root, async () => await bookmarks.getChildren(root()!.id));
    const [currentProject, { refetch: refetchCurrent }] = createResource(getCurrentProject);

    async function reloadCurrent(id: string) {
        const bookmark = (await bookmarks.get(id))[0];
        if (bookmark.parentId === root()?.id) {
            refetchProjects();
            return;
        }

        if (!currentProject()) {
            return;
        }

        refetchCurrent();
    }

    bookmarks.onChanged.addListener(reloadCurrent);
    bookmarks.onCreated.addListener(reloadCurrent);
    bookmarks.onRemoved.addListener(reloadCurrent);
    bookmarks.onMoved.addListener(reloadCurrent);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Header currentProject={currentProject} projects={projects} root={root} />

            <main style={{ display: "flex", flex: 1, 'flex-direction': "column", "align-items": "center", "justify-content": "center" }}>
                <Clock />
                <Projects projects={projects} currentProject={currentProject} refetchCurrent={refetchCurrent} />

                <ol style={{ display: "flex", "justify-content": "center" }}>
                    <For each={currentProject()?.children}>
                        {(group) => <LinkGroup group={group} />}
                    </For>
                </ol>
            </main>

            <aside>
                <Tasks currentProject={currentProject} />
            </aside>
        </div>
    );
}