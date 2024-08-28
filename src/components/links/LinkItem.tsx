import { Component } from "solid-js";

import "./LinkItem.css";
import { Options } from "../util/Options";

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
            <Options edit={edit} remove={remove}>
                <a class="link-item__title" href={props.link.url}>{props.link.title}</a>
            </Options>

            <dialog ref={dialogEl}>
                <h3>Edit link</h3>
                <form method="dialog" onSubmit={update}>
                    <input ref={inputEl} type="text" value={props.link.title} />
                    <input type="url" value={props.link.url} />

                    <button type="submit">Save</button>
                </form>
            </dialog>
        </li>
    )
}