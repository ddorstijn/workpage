import { Component } from "solid-js"
import { bookmarks, Bookmarks } from "webextension-polyfill"

interface Props {
    link: Bookmarks.BookmarkTreeNode
}

export const LinkItem: Component<Props> = props => {
    let linkDialog: HTMLDialogElement | undefined;

    async function deleteLink() {
        await bookmarks.remove(props.link.id);
    }

    async function updateLink(e: SubmitEvent) {
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const title = formData.get("title") as string;
        const url = formData.get("url") as string;
        await bookmarks.update(props.link.id, { title, url });
        form.reset();
    }

    return <li style={{ display: "flex", "justify-content": "space-between" }}>
        <a href={props.link.url}>{props.link.title}</a>
        <div class="options">
            <button class="edit" onClick={() => linkDialog?.showModal()}><i class="ph ph-pen" /></button>
            <dialog ref={linkDialog}>
                <div>
                    <form method="dialog" onSubmit={updateLink}>
                        <label>
                            <span>Title</span>
                            <input name="title" type="text" value={props.link.title} />
                        </label>
                        <label>
                            <span>URL</span>
                            <input name="url" type="text" value={props.link.url} />
                        </label>
                        <button type="submit">Save</button>
                    </form>
                </div>
            </dialog>
            <button class="delete" onClick={deleteLink}><i class="ph ph-x" /></button>
        </div>
    </li>
}