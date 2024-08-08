import { Component, For, Resource } from "solid-js";
import { setCurrentProject } from "../../util";
import { bookmarks, Bookmarks } from "webextension-polyfill";

interface Props {
    projects: Resource<Bookmarks.BookmarkTreeNode[]>;
    currentProject: Resource<Bookmarks.BookmarkTreeNode | null>;
}

export const Projects: Component<Props> = (props) => {
    let projectDialog: HTMLDialogElement | undefined;

    async function deleteProject(project: Bookmarks.BookmarkTreeNode) {
        await bookmarks.removeTree(project.id);

        if (props.currentProject()?.id === project.id) {
            await setCurrentProject(null);
        }
    }

    return <>
        <button onClick={() => projectDialog?.showModal()}>{props.currentProject()?.title}</button>
        <dialog ref={projectDialog}>
            <div>
                <ol>
                    <For each={props.projects()}>
                        {(project) =>
                            <li>
                                <button onClick={[setCurrentProject, project]}>
                                    {project.title}
                                    {props.currentProject()?.id === project.id ? "(current)" : ""}
                                </button>
                                <button onClick={[deleteProject, project]}>Delete</button>
                            </li>
                        }
                    </For>
                </ol>
            </div>
        </dialog>
    </>
}