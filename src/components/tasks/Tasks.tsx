import { Component, createMemo, createResource, For, Resource } from "solid-js";
import { sortable } from "~/shared/js/sortable";

import { TaskItem } from "./TaskItem";
import { ExpandSearch } from "../util/ExpandSearch";

import "./Tasks.css";

interface Props {
  currentProject: Resource<chrome.bookmarks.BookmarkTreeNode | null>;
}

export const TASKS_PREFIX = "t-";

export type Task = {
  id: string;
  title: string;
  completed: number | undefined;
};

export const Tasks: Component<Props> = (props) => {
  const [tasks, { refetch: refetchTasks }] = createResource<Task[]>(
    async () => {
      if (!props.currentProject()) return [];

      const key = TASKS_PREFIX + props.currentProject()!.id;
      return (await chrome.storage.sync.get(key))[key] ?? [];
    }
  );

  createMemo(async () => {
    if (!props.currentProject()) return;

    await refetchTasks();
  });

  chrome.storage.sync.onChanged.addListener(async (info) => {
    if (!props.currentProject()) return;

    const key = TASKS_PREFIX + props.currentProject()!.id;
    if (info[key]) {
      await refetchTasks();
    }
  });

  async function filter(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.trim().toLowerCase();
    const listItems = document
      .getElementById("task-list")!
      .querySelectorAll(".task-item") as NodeListOf<HTMLLIElement>;

    for (let i = 0; i < listItems.length; i++) {
      const item = listItems[i];

      if (
        !item
          .querySelector(".task-item__title")!
          .textContent!.trim()
          .toLowerCase()
          .includes(searchTerm)
      ) {
        item.classList.add("hidden");
        continue;
      }

      item.classList.remove("hidden");
    }
  }

  async function addTask(event: KeyboardEvent) {
    event.preventDefault();

    if (!props.currentProject()) return;

    const textarea = event.target as HTMLTextAreaElement;
    const title = textarea.value;

    if (!title) return;
    textarea.value = "";

    const id = crypto.randomUUID();
    const newTask = { id, title, completed: undefined };
    const newTasks = [newTask, ...tasks()!];

    const key = TASKS_PREFIX + props.currentProject()!.id;
    await chrome.storage.sync.set({ [key]: newTasks });
  }

  async function updateTask(newTask: Task) {
    const key = TASKS_PREFIX + props.currentProject()!.id;
    const newTasks = tasks()!.map((task) => {
      if (task.id === newTask.id) {
        return newTask;
      }

      return task;
    });

    await chrome.storage.sync.set({ [key]: newTasks });
  }

  async function removeTask(id: string) {
    const key = `t-${props.currentProject()!.id}`;
    const newTasks = tasks()!.filter((task) => task.id !== id);

    await chrome.storage.sync.set({ [key]: newTasks });
  }

  async function move(index: number) {
    const ids = tasks()!.map((task) => task.id);
    const fromIndex = ids.indexOf(window.dragCtx!.item.id);

    arrayMove(tasks()!, fromIndex, index);

    const key = TASKS_PREFIX + props.currentProject()!.id;
    await chrome.storage.sync.set({ [key]: tasks() });
  }

  function arrayMove(arr: unknown[], fromIndex: number, toIndex: number) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  function initSortable(el: HTMLElement) {
    sortable({ el, group: "tasks", mode: "vertical", onDrop: move });
  }

  return (
    <section id="tasks">
      <header>
        <button
          class="clear"
          style={{ color: "var(--sidebar-text)" }}
          popoverTarget="task-drawer"
        >
          <h2>Tasks</h2>
          <i class="ph ph-arrow-up-right"></i>
        </button>

        <div class="toolbar">
          <ExpandSearch filter={filter} />
          <label
            id="add-task-btn"
            class="toggle"
            aria-controls="add-task-form"
            onClick={() => document.getElementById("task-new")!.focus()}
          >
            <input name="open-form" type="checkbox" />
            <i class="open ph ph-plus"></i>
            <i class="close ph ph-minus"></i>
            new
          </label>
        </div>

        <div id="add-task-form" class="task-item">
          <label class="checkbox">
            <input name="fake-checkbox" type="checkbox" disabled />
            <span class="unchecked">
              <i class="ph ph-circle"></i>
            </span>
            <span class="checked">
              <i class="ph ph-check-circle"></i>
            </span>
          </label>
          <textarea
            id="task-new"
            name="task-new"
            placeholder="New task"
            rows="1"
            onKeyDown={(event) => event.key === "Enter" && addTask(event)}
          ></textarea>
        </div>
      </header>

      <ol id="task-list" ref={initSortable}>
        <For each={tasks()?.filter((task) => !task.completed)}>
          {(task) => (
            <TaskItem task={task} update={updateTask} remove={removeTask} />
          )}
        </For>
      </ol>

      <div id="task-drawer" popover>
        <header>
          <h2>Tasks</h2>
        </header>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            <For each={tasks()}>
              {(task) => (
                <tr>
                  <td>{task.title}</td>
                  <td>{task.completed ? "✓" : ""}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </section>
  );
};
