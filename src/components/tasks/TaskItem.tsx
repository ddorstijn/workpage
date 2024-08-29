import { Component, Resource } from "solid-js"

import "./TaskItem.css";
import { Options } from "../util/Options";
import { draggable } from "~/shared/js/sortable";

interface Props {
    task: { id: string, title: string, completed: boolean }
    currentProject: Resource<chrome.bookmarks.BookmarkTreeNode | null>
}

export const TaskItem: Component<Props> = (props) => {
    let inputEl: HTMLTextAreaElement | undefined;
    let titleEl: HTMLSpanElement | undefined;

    async function edit() {
        titleEl?.classList.add('hidden');
        inputEl?.classList.remove('hidden');
        inputEl?.focus();
    }

    async function remove() {
        const key = `t-${props.currentProject()!.id}`;

        const tasks = await chrome.storage.sync.get(key);
        const newTasks = tasks[key].filter((task: string) => task !== props.task.id);
        await chrome.storage.sync.set({ [key]: newTasks });
        await chrome.storage.sync.remove(props.task.id);
    }

    async function update() {
        inputEl?.classList.add('hidden');
        titleEl?.classList.remove('hidden');

        props.task.title = inputEl!.value;
        await chrome.storage.sync.set({ [props.task.id]: props.task });
    };

    async function complete(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        await chrome.storage.sync.set({ [props.task.id]: { title: props.task.title, completed: checkbox.checked } });
    }

    return (
        <li id={props.task.id} class="task-item" ref={(el) => draggable(el, ".task-item__handle")}>
            <div class="task-item__handle"></div>
            <label class="checkbox">
                <input type="checkbox" checked={props.task.completed} onChange={complete} />
                <span class="unchecked"><i class="ph ph-circle"></i></span>
                <span class="checked"><i class="ph ph-check-circle"></i></span>
            </label>
            <Options edit={edit} remove={remove}>
                <span ref={titleEl} class="task-item__title">{props.task.title}</span>
                <textarea
                    name="task-item__input"
                    class="task-item__input hidden"
                    value={props.task.title}
                    ref={inputEl}
                    onBlur={update}
                    onKeyDown={(event) => event.key === 'Enter' && inputEl?.blur()}
                ></textarea>
            </Options>
        </li>
    )
}