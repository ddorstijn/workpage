import { Component, For } from "solid-js"
import { Bookmarks } from "webextension-polyfill"
import { LinkItem } from "./LinkItem"

type Props = {
    group: Bookmarks.BookmarkTreeNode
    deleteGroup: (group: Bookmarks.BookmarkTreeNode) => void
    deleteLink: (link: Bookmarks.BookmarkTreeNode) => void
}

export const LinkGroup: Component<Props> = props => {
    return <li>
        <h3>{props.group.title}</h3>
        <button onClick={() => props.deleteGroup(props.group)}>Delete</button>
        <ol>
            <For each={props.group.children}>
                {(link) =>
                    <LinkItem link={link} deleteLink={props.deleteLink} />
                }
            </For>
        </ol>
    </li>
}