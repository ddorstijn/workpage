import { Component, createResource, For, Resource } from "solid-js";
import { mergeLocalStorage } from "../util";
import { Bookmarks, storage } from "webextension-polyfill";
import { Item, TaskItem } from "./TaskItem";

interface Props {
    currentProject: Resource<Bookmarks.BookmarkTreeNode | null>
};

export const Tasks: Component<Props> = (props) => {
    const [tasks, { mutate: setTasks }] = createResource(props.currentProject, async () => {
        if (!props.currentProject()) {
            return [];
        }

        const project = (await storage.local.get(props.currentProject()!.id))[props.currentProject()!.id];
        if (project === undefined) {
            return [];
        }

        return project.tasks as Item[];
    });

    async function addTask(e: SubmitEvent) {
        e.preventDefault();

        if (!props.currentProject()) {
            return;
        }

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const title = formData.get("title") as string;
        if (!title) {
            return;
        }

        setTasks((todos) => [...todos!, { id: crypto.randomUUID(), title, completed: false }]);
        await mergeLocalStorage(props.currentProject()!.id, { tasks: tasks() });

        form.reset();
    };

    async function toggleCompleted(id: string) {
        const newTasks = tasks()!.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
        setTasks(newTasks);

        await mergeLocalStorage(props.currentProject()!.id, { tasks: tasks() });
    }

    return (
        <div>
            <h1>Tasks</h1>
            <form onSubmit={addTask}>
                <input aria-label="Add a new task" name="title" type="text" placeholder="Add a new task" />
                <button type="submit">Add</button>
            </form>

            <ol>
                <For each={tasks()}>
                    {(item) =>
                        <TaskItem item={item} toggleCompleted={toggleCompleted} />
                    }
                </For>
            </ol>
        </div>
    );
};