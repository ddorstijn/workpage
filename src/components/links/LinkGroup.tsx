import { Component, createResource, For } from "solid-js";
import { LinkItem } from "./LinkItem";

import "./LinkGroup.css";

interface Props {
    group: chrome.bookmarks.BookmarkTreeNode
}

export const LinkGroup: Component<Props> = (props) => {
    const [links, { refetch: refetchLinks }] = createResource(async () => {
        if (!props.group) {
            return [];
        }

        return await chrome.bookmarks.getChildren(props.group.id);
    });

    chrome.bookmarks.onCreated.addListener(async (_, bookmark) => {
        if (bookmark.parentId === props.group?.id) {
            await refetchLinks();
        }
    });

    chrome.bookmarks.onRemoved.addListener(async (_, info) => {
        if (info.parentId === props.group?.id) {
            await refetchLinks();
        }
    });

    chrome.bookmarks.onChanged.addListener(async (id) => {
        if (links()?.find((link) => link.id === id)) {
            await refetchLinks();
        }
    });

    return (
        <li class="group-item">
            <div class="group-item__header">
                <h2 class="group-title">{props.group.title}</h2>
            </div>
            <ol class="group-links">
                <For each={links()}>
                    {(link) => <LinkItem link={link} />}
                </For>
            </ol>
        </li>
    );
}