import { Component, For } from "solid-js"
import { bookmarks, Bookmarks } from "webextension-polyfill"
import { LinkItem } from "./LinkItem"

interface Props {
    group: Bookmarks.BookmarkTreeNode
}

export const LinkGroup: Component<Props> = props => {
    async function deleteGroup() {
        await bookmarks.removeTree(props.group.id);
    }

    return <li style={{ width: "250px" }}>
        <div style={{ display: "flex", "justify-content": "space-between" }}>
            <h3>{props.group.title}</h3>
            <div class="options">
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