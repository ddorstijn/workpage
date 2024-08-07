import { Component } from "solid-js"
import { bookmarks, Bookmarks } from "webextension-polyfill"

type Props = {
    link: Bookmarks.BookmarkTreeNode
}

export const LinkItem: Component<Props> = props => {
    async function deleteLink() {
        await bookmarks.remove(props.link.id);
    }

    return <li>
        <a href={props.link.url}>{props.link.title}</a>
        <button onClick={deleteLink}>Delete</button>
    </li>
}