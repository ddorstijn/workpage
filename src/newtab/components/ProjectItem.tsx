import { Component, Resource } from "solid-js";
import { setCurrentProject } from "../../util";
import { bookmarks, Bookmarks } from "webextension-polyfill";

interface Props {
    project: Bookmarks.BookmarkTreeNode
    currentProject: Resource<Bookmarks.BookmarkTreeNode | null>
}

export const ProjectItem: Component<Props> = props => {
    let projectDialog: HTMLDialogElement | undefined;

    async function deleteProject(project: Bookmarks.BookmarkTreeNode) {
        await bookmarks.removeTree(project.id);

        if (props.currentProject()?.id === project.id) {
            await setCurrentProject(null);
        }
    }

    async function updateProject(event: Event) {
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const title = formData.get("title") as string;
        await bookmarks.update(props.project.id, { title });
        form.reset();
    }

    return <li>
        <button onClick={[setCurrentProject, props.project]}>
            {props.project.title}
            {props.currentProject()?.id === props.project.id ? "(current)" : ""}
        </button>
        <div class="options">
            <button class="edit" onClick={() => projectDialog?.showModal()}><i class="ph ph-pen" /></button>
            <dialog ref={projectDialog}>
                <div>
                    <form method="dialog" onSubmit={updateProject}>
                        <label>
                            <span>Title</span>
                            <input name="title" type="text" value={props.project.title} />
                        </label>
                        <button type="submit">Save</button>
                    </form>
                </div>
            </dialog>
            <button onClick={[deleteProject, props.project]}><i class="ph ph-x" /></button>
        </div>
    </li>
}