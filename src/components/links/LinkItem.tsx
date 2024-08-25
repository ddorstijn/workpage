import { Component } from "solid-js";

import "./LinkItem.css";

interface Props {
    link: chrome.bookmarks.BookmarkTreeNode
}

export const LinkItem: Component<Props> = (props) => {
    return (
        <li class="link-item">
            <a href={props.link.url}>{props.link.title}</a>
        </li>
    )
}