import { Component, createMemo, createResource, For, Resource } from "solid-js";
import { sortable } from "~/shared/js/sortable";

import { LinkGroup } from "./LinkGroup";

import "./Links.css";

interface Props {
    currentProject: Resource<chrome.bookmarks.BookmarkTreeNode | null>;
}

export const Links: Component<Props> = (props) => {
    const [groups, { refetch: refetchGroups }] = createResource(async () => {
        if (!props.currentProject()) {
            return [];
        }

        return await chrome.bookmarks.getChildren(props.currentProject()!.id);
    });

    createMemo(async () => {
        if (props.currentProject()) {
            refetchGroups();
        }
    });

    chrome.bookmarks.onCreated.addListener(async (_, bookmark) => {
        if (bookmark.parentId === props.currentProject()?.id) {
            await refetchGroups();
        }
    });

    chrome.bookmarks.onRemoved.addListener(async (_, info) => {
        if (info.parentId === props.currentProject()?.id) {
            await refetchGroups();
        }
    });

    chrome.bookmarks.onChanged.addListener(async (id) => {
        if (groups()?.find((group) => group.id === id)) {
            await refetchGroups();
        }
    });

    chrome.bookmarks.onMoved.addListener(async (id) => {
        if (groups()?.find((group) => group.id === id)) {
            await refetchGroups();
        }
    })

    async function move(index: number) {
        await chrome.bookmarks.move(window.dragCtx!.item.id, { parentId: props.currentProject()!.id, index: index });
    }

    function initSortable(el: HTMLElement) {
        sortable({ el, group: "linkgroups", mode: "horizontal", onDrop: move });
    }

    return (
        <section aria-label="Links" id="links">
            <ol id="group-list" ref={initSortable}>
                <For each={groups()}>
                    {(group) => <LinkGroup group={group} />}
                </For>
            </ol>
        </section>
    );
}