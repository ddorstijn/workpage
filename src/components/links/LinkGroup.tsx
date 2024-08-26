import { Component, createResource, For } from "solid-js";
import { LinkItem } from "./LinkItem";

import "./LinkGroup.css";

interface Props {
    group: chrome.bookmarks.BookmarkTreeNode
}

export const LinkGroup: Component<Props> = (props) => {
    let inputEl: HTMLInputElement | undefined;
    let titleEl: HTMLHeadingElement | undefined;

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

    async function edit() {
        titleEl?.classList.add('hidden');
        inputEl?.classList.remove('hidden');
        inputEl?.focus();
    }

    async function remove() {
        await chrome.bookmarks.remove(props.group.id);
    }

    async function update() {
        inputEl?.classList.add('hidden');
        titleEl?.classList.remove('hidden');
        await chrome.bookmarks.update(props.group.id, { title: inputEl!.value });
    }

    return (
        <li class="group-item">
            <div class="group-item__header">
                <input
                    ref={inputEl}
                    class="group-item__input hidden"
                    value={props.group.title} onBlur={update}
                    onKeyDown={(event) => event.key === 'Enter' && inputEl?.blur()}
                />
                <h2 ref={titleEl} class="group-item__title">{props.group.title}</h2>

                <div class="options">
                    <button class="clear edit" onClick={edit}>
                        <i class="ph-fill ph-pen"></i>
                    </button>
                    <button class="clear delete" onClick={remove}>
                        <i class="ph-fill ph-trash-simple"></i>
                    </button>
                </div>
            </div>
            <ol class="group-item__links">
                <For each={links()}>
                    {(link) => <LinkItem link={link} />}
                </For>
            </ol>
        </li>
    );
}