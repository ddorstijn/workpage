import { Component, For, createEffect, createSignal, useContext } from "solid-js";
import { DragEventHandler, DragDropProvider, SortableProvider, createSortable, closestCenter, DragDropSensors, DragOverlay } from "@thisbeyond/solid-dnd";

import AddIcon from "~icons/material-symbols/add";
import ChevronLeftIcon from "~icons/material-symbols/chevron-left-rounded";

import styles from "./Tasks.module.css";
import { ProjectContext } from "./Context";

const Tasks: Component = () => {
  let ctx = useContext(ProjectContext);
  let [ids, setIds] = createSignal<number[]>([]);
  createEffect(() => setIds(ctx!.project.todo.map((_, id) => id + 1)));

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = ids();
      const fromIndex = currentItems.findIndex(id => id == draggable.id);
      const toIndex = currentItems.findIndex(id => id == droppable.id);
      if (fromIndex !== toIndex) {
        const updatedItems = ctx!.project.todo.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        ctx?.setProject("todo", updatedItems);
      }
    }
  }
  
  return (
    <details class={styles["task-drawer"]}>
      <summary>
        <span>Tasks</span>
        <ChevronLeftIcon />
      </summary>
      <section class={styles["tasks"]}>
        <header>
          <h3 class="active">Todo</h3>
          <h3>Done</h3>
        </header>
        <DragDropProvider onDragEnd={onDragEnd} collisionDetector={closestCenter}>
          <DragDropSensors />
          <ol>
            <SortableProvider ids={ids()}>
              <For each={ctx?.project.todo}>
                { (task, id) => <Task id={id() + 1} task={task} /> }
              </For>
            </SortableProvider>
          </ol>
        </DragDropProvider>
        <button class={styles["add-task"]}>
          <AddIcon />
          <span>Add a task</span>
        </button>
      </section>
    </details>
  )
}

export default Tasks;

declare module "solid-js" {
  namespace JSX {
    interface DirectiveFunctions {
      sortable: ReturnType<typeof createSortable>;
    }
  }
}

const Task: Component<{id: number, task: Task}> = (props) => {
  // @ts-ignore
  const sortable = createSortable(props.id);

  return (
    <li use:sortable class={styles["task-list_item"]}>
      <div class={styles["handle"]}></div>
      <span>{props.id} - {props.task.name}</span>
    </li>
  )
}