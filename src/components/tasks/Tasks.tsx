import { Component, createMemo, createResource, For, Resource } from "solid-js";
import { TaskItem } from "./TaskItem";

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

    async function onFilterInput(event: Event) {
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

    async function submitAddTask(event: SubmitEvent) {
        event.preventDefault();

        if (!props.currentProject()) return;

        const form = event.target as HTMLFormElement;
        const title = form.querySelector('input')!.value;
        form.reset();

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
                    <label class="expand-search">
                        <input id="task-search" type="search" placeholder="Search task" onInput={onFilterInput} />
                        <i class="ph ph-magnifying-glass"></i>
                    </label>
                    <label id="add-task-btn" class="toggle" aria-controls="add-task-form" onClick={() => document.getElementById('task-new')!.focus()}>
                        <input type="checkbox" />
                        <i class="open ph ph-plus"></i>
                        <i class="close ph ph-minus"></i>
                        new
                    </label>
                </div>
            </header>

            <div id="add-task-form" class="card">
                <form onsubmit={submitAddTask}>
                    <input id="task-new" type="text" placeholder="New task" />
                    <button type="submit">Add</button>
                </form>
            </div>

            <ol id="task-list">
                <For each={tasks()}>
                    {(task) => <TaskItem task={task} />}
                </For>
            </ol>
        </section>
    );
}
