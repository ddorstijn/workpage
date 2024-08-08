import { Component, For, Resource } from "solid-js";
import { Bookmarks } from "webextension-polyfill";
import { ProjectItem } from "./ProjectItem";

interface Props {
    projects: Resource<Bookmarks.BookmarkTreeNode[]>;
    currentProject: Resource<Bookmarks.BookmarkTreeNode | null>;
}

export const Projects: Component<Props> = (props) => {
    let projectDialog: HTMLDialogElement | undefined;

    return <>
        <button onClick={() => projectDialog?.showModal()}>{props.currentProject()?.title}</button>
        <dialog ref={projectDialog}>
            <div style={{ width: "250px" }}>
                <ol>
                    <For each={props.projects()}>
                        {(project) => <ProjectItem project={project} currentProject={props.currentProject} />}
                    </For>
                </ol>
            </div>
        </dialog>
    </>
}