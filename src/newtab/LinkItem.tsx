import { Component } from "solid-js"
import { Bookmarks } from "webextension-polyfill"

type Props = {
    link: Bookmarks.BookmarkTreeNode
    deleteLink: (link: Bookmarks.BookmarkTreeNode) => void
}

export const LinkItem: Component<Props> = props => {
    return <li>
        <a href={props.link.url}>{props.link.title}</a>
        <button onClick={() => props.deleteLink(props.link)}>Delete</button>
    </li>
}