import { Component, createMemo, createSignal, For, Resource } from "solid-js";
import { formatDateTime } from "~/shared/js/format";
import { Task } from "./Tasks";

import { ExpandSearch } from "../util/ExpandSearch";

import "./TaskDrawer.css";

type Props = {
  tasks: Resource<Task[] | null>;
  remove: (id: string) => Promise<void>;
};

export const TaskDrawer: Component<Props> = (props) => {
  const [search, setSearch] = createSignal("");

  const filteredTasks = createMemo(() => {
    if (!search()) {
      return (
        props
          .tasks()
          ?.sort((a, b) => (a.completed ?? 0) - (b.completed ?? 0)) ?? []
      );
    }

    return (
      props
        .tasks()
        ?.filter((task) =>
          task.title.toLowerCase().includes(search().toLowerCase())
        )
        .sort((a, b) => (a.completed ?? 0) - (b.completed ?? 0)) ?? []
    );
  });

  return (
    <div id="task-drawer" popover>
      <header>
        <h2>Tasks</h2>
        <ExpandSearch setSearch={setSearch} />
      </header>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Completed</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <For each={filteredTasks()}>
            {(task) => (
              <tr>
                <td>{task.title}</td>
                <td>{formatDateTime(task.completed ?? null)}</td>
                <td>
                  <button onClick={() => props.remove(task.id)}>Delete</button>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};
