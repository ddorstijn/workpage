import { Component, createResource, For, Resource } from "solid-js";
import { mergeLocalStorage } from "../util";
import { Bookmarks, storage } from "webextension-polyfill";

type TaskItem = { id: string, title: string, completed: boolean };

type Props = { currentProject: Resource<Bookmarks.BookmarkTreeNode | null> };

export const Tasks: Component<Props> = (props) => {
    const [tasks, { mutate: setTasks }] = createResource(props.currentProject, async () => {
        if (!props.currentProject()) {
            return [];
        }

        const project = (await storage.local.get(props.currentProject()!.id))[props.currentProject()!.id];

        if (project === undefined) {
            return [];
        }

        return project.tasks as TaskItem[];
    });

    async function addTodo(e: SubmitEvent) {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const title = formData.get("title") as string;

        if (!title) {
            return;
        }

        const newTask: TaskItem = { id: crypto.randomUUID(), title, completed: false };
        setTasks((todos) => [...todos!, newTask]);

        (e.target as HTMLFormElement).reset();
        await mergeLocalStorage(props.currentProject()!.id, { tasks: tasks() });
    };

    async function toggleCompleted(id: string) {
        const newTasks = tasks()!.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
        setTasks(newTasks);

        await mergeLocalStorage(props.currentProject()!.id, { tasks: tasks() });
    }

    return (
        <div>
            <h1>Tasks</h1>
            <form onSubmit={addTodo}>
                <label>
                    <span>Title</span>
                    <input name="title" type="text" />
                </label>
                <button type="submit">Add</button>
            </form>

            <ol>
                <For each={tasks()}>
                    {(todo) =>
                        <li>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={[toggleCompleted, todo.id]}
                            />
                            {todo.title}
                        </li>
                    }
                </For>
            </ol>
        </div>
    );
};