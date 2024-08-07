import { Component, createResource, For } from "solid-js";
import { getCurrentProject, recursiveDeleteBookmarks } from "../util";
import { Bookmarks, bookmarks, storage } from "webextension-polyfill";
import { Tasks } from "./Tasks";
import { LinkGroup } from "./LinkGroup";

export const Workpage: Component = () => {
    let groupDialog: HTMLDialogElement | undefined;
    let projectDialog: HTMLDialogElement | undefined;

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

    async function setCurrentProject(project: Bookmarks.BookmarkTreeNode | null) {
        await storage.local.set({ currentProjectId: project?.id });
        await refetchCurrent();
    }

    async function addProject(e: SubmitEvent) {
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const title = formData.get("title") as string;

        if (!title) {
            return;
        }

        const index = projects()!.map(({ index }) => index ?? 0).reduce((prev, cur) => {
            return prev > cur ? prev : cur;
        }, 0);

        await bookmarks.create({ title, parentId: root()!.id, index });
        await refetchProjects();
    }

    async function deleteProject(project: Bookmarks.BookmarkTreeNode) {
        await recursiveDeleteBookmarks(project);
        await refetchProjects();

        if (currentProject()?.id === project.id) {
            await setCurrentProject(null);
        }
    }

    async function addGroup(e: SubmitEvent) {
        if (!currentProject()) {
            return;
        }

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const title = formData.get("title") as string;
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

    async function deleteLink(link: Bookmarks.BookmarkTreeNode) {
        await bookmarks.remove(link.id);
        await refetchCurrent();
    }

    return (
        <div>
            <h1>Workpage</h1>
            <button onClick={() => projectDialog?.showModal()}>Add Project</button>
            <dialog ref={projectDialog}>
                <form method="dialog" onSubmit={addProject}>
                    <label>
                        Title
                        <input name="title" type="text" />
                    </label>
                    <button type="submit">Add</button>
                </form>
            </dialog>

            <button onClick={() => groupDialog?.showModal()}>Add group</button>

            <dialog ref={groupDialog}>
                <form method="dialog" onSubmit={addGroup}>
                    <label>
                        Title
                        <input name="title" type="text" />
                    </label>
                    <button type="submit">Add</button>
                </form>
            </dialog>

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
                        <LinkGroup group={group} deleteGroup={deleteGroup} deleteLink={deleteLink} />
                    }
                </For>
            </ol>

            <div>
                <Tasks currentProject={currentProject} />
            </div>
        </div>

    );
}