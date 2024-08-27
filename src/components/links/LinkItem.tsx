import { Component } from "solid-js";

import "./LinkItem.css";

interface Props {
    link: chrome.bookmarks.BookmarkTreeNode
}

export const LinkItem: Component<Props> = (props) => {
    async function remove() {
        await chrome.bookmarks.remove(props.link.id);
    }

    async function edit() {
        dialogEl?.showModal();
        inputEl?.focus();
    }

    async function update(event: SubmitEvent) {
        await chrome.bookmarks.update(props.link.id, { title: inputEl!.value });

        (event.target as HTMLFormElement).reset();
    }

    let inputEl: HTMLInputElement | undefined;
    let dialogEl: HTMLDialogElement | undefined;

    return (
        <li class="link-item">
            <a class="link-item__title" href={props.link.url}>{props.link.title}</a>

            <dialog ref={dialogEl}>
                <h3>Edit link</h3>
                <form method="dialog" onSubmit={update}>
                    <input ref={inputEl} type="text" value={props.link.title} />
                    <input type="url" value={props.link.url} />

                    <button type="submit">Save</button>
                </form>
            </dialog>

            <div class="options">
                <button class="clear edit" onClick={edit}>
                    <i class="ph-fill ph-pen"></i>
                </button>
                <button class="clear delete" onClick={remove}>
                    <i class="ph-fill ph-trash-simple"></i>
                </button>
            </div>
        </li>
    )
}