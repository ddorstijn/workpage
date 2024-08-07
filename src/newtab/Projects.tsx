import { Component, For, JSX, Resource } from "solid-js";
import { bookmarks, storage, Bookmarks } from "webextension-polyfill";

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
    projects: Resource<Bookmarks.BookmarkTreeNode[]>;
    currentProject: Resource<Bookmarks.BookmarkTreeNode | null>;
    refetchCurrent: Function;
}

export const Projects: Component<Props> = (props) => {
    let projectDialog: HTMLDialogElement | undefined;

    async function setCurrentProject(project: Bookmarks.BookmarkTreeNode | null) {
        await storage.local.set({ currentProjectId: project?.id });
        await props.refetchCurrent();
    }

    async function deleteProject(project: Bookmarks.BookmarkTreeNode) {
        await bookmarks.removeTree(project.id);

        if (props.currentProject()?.id === project.id) {
            await setCurrentProject(null);
        }
    }

    return <>
        <button {...props} onClick={() => projectDialog?.showModal()}>{props.currentProject()?.title}</button>
        <dialog ref={projectDialog}>
            <ol>
                <For each={props.projects()}>
                    {(project) =>
                        <li>
                            <button onClick={() => setCurrentProject(project)}>
                                {project.title}
                                {props.currentProject()?.id === project.id ? "(current)" : ""}
                            </button>
                            <button onClick={() => deleteProject(project)}>Delete</button>
                        </li>
                    }
                </For>
            </ol>
        </dialog>
    </>
}