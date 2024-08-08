import { Component, For } from "solid-js"
import { bookmarks, Bookmarks } from "webextension-polyfill"
import { LinkItem } from "./LinkItem"

interface Props {
    group: Bookmarks.BookmarkTreeNode
}

export const LinkGroup: Component<Props> = props => {
    let groupDialog: HTMLDialogElement | undefined;

    async function deleteGroup() {
        await bookmarks.removeTree(props.group.id);
    }

    async function updateGroup(event: Event) {
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const title = formData.get("title") as string;
        await bookmarks.update(props.group.id, { title });
        form.reset();
    }

    return <li style={{ width: "250px" }}>
        <div style={{ display: "flex", "justify-content": "space-between" }}>
            <h3>{props.group.title}</h3>
            <div class="options">
                <button class="edit" onClick={() => groupDialog?.showModal()}><i class="ph ph-pen" /></button>
                <dialog ref={groupDialog}>
                    <div>
                        <form method="dialog" onSubmit={updateGroup}>
                            <label>
                                <span>Title</span>
                                <input name="title" type="text" value={props.group.title} />
                            </label>
                            <button type="submit">Save</button>
                        </form>
                    </div>
                </dialog>
                <button class="delete" onClick={deleteGroup}><i class="ph ph-x"></i></button>
            </div>
        </div>
        <ol>
            <For each={props.group.children}>
                {(link) => <LinkItem link={link} />}
            </For>
        </ol>
    </li>
}