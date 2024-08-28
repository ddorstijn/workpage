import { Component, createMemo, createResource, For, Resource } from "solid-js";
import { TaskItem } from "./TaskItem";
import { ExpandSearch } from "../timer/ExpandSearch";

import "./Tasks.css";

interface Props {
    currentProject: Resource<chrome.bookmarks.BookmarkTreeNode | null>;
}

export const Tasks: Component<Props> = (props) => {
    function getProjectTaskKey(project: chrome.bookmarks.BookmarkTreeNode) {
        return `t-${project.id}`;
    }

    async function getTasks() {
        const project = props.currentProject();
        if (!project) return [];

        const key = getProjectTaskKey(project);
        const storedTasks = (await chrome.storage.sync.get(key))[key] as string[] | undefined;
        if (!storedTasks) return [];

        return await Promise.all(
            storedTasks.map((taskId) =>
                chrome.storage.sync.get(taskId).then(
                    (result) => ({
                        id: taskId,
                        title: result[taskId]?.title,
                        completed: result[taskId]?.completed,
                    })
                )
            )
        );
    }

    const [tasks, { refetch: refetchTasks }] = createResource(getTasks);

    createMemo(async () => {
        if (!props.currentProject()) return;

        await refetchTasks();
    });

    chrome.storage.sync.onChanged.addListener(async (info) => {
        if (!props.currentProject()) return;

        const project = props.currentProject()!;
        const key = getProjectTaskKey(project);
        for (const taskKey in info) {
            if (taskKey === key || tasks()?.find((task) => task.id === taskKey)) {
                await refetchTasks();
                break;
            }
        }
    });

    async function filter(event: Event) {
        const input = event.target as HTMLInputElement;
        const searchTerm = input.value.trim().toLowerCase();
        const listItems = document.getElementById('task-list')!.querySelectorAll('.task-item') as NodeListOf<HTMLLIElement>;

        for (let i = 0; i < listItems.length; i++) {
            const item = listItems[i];

            if (!item.querySelector('.task-item__title')!.textContent!.trim().toLowerCase().includes(searchTerm)) {
                item.classList.add('hidden');
                continue;
            }

            item.classList.remove('hidden');
        }
    }

    async function add(event: KeyboardEvent) {
        event.preventDefault();

        if (!props.currentProject()) return;

        const textarea = event.target as HTMLTextAreaElement;
        const title = textarea.value;
        textarea.value = "";

        const id = crypto.randomUUID();
        const newTask = { id, title, completed: false };
        const newTasks = [newTask, ...tasks()!];

        await Promise.all([
            chrome.storage.sync.set({ [id]: { title, completed: false } }),
            chrome.storage.sync.set({ [getProjectTaskKey(props.currentProject()!)]: newTasks.map((task) => task.id) }),
        ]);
    }

    return (
        <section id="tasks">
            <header>
                <h2>Tasks</h2>

                <div class="toolbar">
                    <ExpandSearch filter={filter} />
                    <label id="add-task-btn" class="toggle" aria-controls="add-task-form" onClick={() => document.getElementById('task-new')!.focus()}>
                        <input type="checkbox" />
                        <i class="open ph ph-plus"></i>
                        <i class="close ph ph-minus"></i>
                        new
                    </label>
                </div>

                <div id="add-task-form" class="task-item">
                    <label class="checkbox">
                        <input type="checkbox" disabled />
                        <span class="unchecked"><i class="ph ph-circle"></i></span>
                        <span class="checked"><i class="ph ph-check-circle"></i></span>
                    </label>
                    <textarea
                        id="task-new"
                        name="task-new"
                        placeholder="New task"
                        rows="1"
                        onKeyDown={(event) => event.key === 'Enter' && add(event)}
                    ></textarea>
                </div>
            </header>

            <ol id="task-list">
                <For each={tasks()}>
                    {(task) => <TaskItem currentProject={props.currentProject} task={task} />}
                </For>
            </ol>
        </section>
    );
}
