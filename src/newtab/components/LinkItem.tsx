import { Component } from "solid-js"
import { bookmarks, Bookmarks } from "webextension-polyfill"

interface Props {
    link: Bookmarks.BookmarkTreeNode
}

export const LinkItem: Component<Props> = props => {
    async function deleteLink() {
        await bookmarks.remove(props.link.id);
    }

    return <li style={{ display: "flex", "justify-content": "space-between" }}>
        <a href={props.link.url}>{props.link.title}</a>
        <div class="options">
            <button class="delete" onClick={deleteLink}><i class="ph ph-x" /></button>
        </div>
    </li>
}