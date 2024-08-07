import { Component, For } from "solid-js"
import { bookmarks, Bookmarks } from "webextension-polyfill"
import { LinkItem } from "./LinkItem"

type Props = {
    group: Bookmarks.BookmarkTreeNode
}

export const LinkGroup: Component<Props> = props => {
    async function deleteGroup() {
        await bookmarks.removeTree(props.group.id);
    }

    return <li>
        <h3>{props.group.title}</h3>
        <button onClick={deleteGroup}>Delete</button>
        <ol>
            <For each={props.group.children}>
                {(link) => <LinkItem link={link} />}
            </For>
        </ol>
    </li>
}