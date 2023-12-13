import { Component, For, createEffect, createSignal, useContext } from "solid-js";
import { DragEventHandler, DragDropProvider, SortableProvider, createSortable, closestCenter, DragDropSensors } from "@thisbeyond/solid-dnd";

import AddIcon from "~icons/material-symbols/add";
import ChevronLeftIcon from "~icons/material-symbols/chevron-left-rounded";

import styles from "./Tasks.module.css";
import { ProjectContext } from "./Context";

const Tasks: Component = () => {
  let ctx = useContext(ProjectContext);
  let [items, setItems] = createSignal<[string, Task][]>([]);

  createEffect(() => {
    if (!ctx) return;
    setItems(ctx!.project.todo.map(t => { 
      return [crypto.randomUUID(), t ] as [string, Task];
    }));
  });

  const [activeItem, setActiveItem] = createSignal<string>();
  const onDragStart: DragEventHandler = ({ draggable }) => {
    setActiveItem(draggable.id as string);
    console.log("START DRAGGING");
  }
  createEffect(() => console.log(activeItem()));

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = items().map(([id, _]) => id);
      const fromIndex = currentItems.findIndex(id => id == draggable.id);
      const toIndex = currentItems.findIndex(id => id == droppable.id);
      if (fromIndex !== toIndex) {
        const updatedItems = items().slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        console.log(updatedItems);
        
        setItems(updatedItems);
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
        <DragDropProvider
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          collisionDetector={closestCenter}
        >
          <DragDropSensors />
          <ol>
            <SortableProvider ids={items().map(([id, _]) => id)}>
              <For each={items()}>
                { ([id, task]) => <Task id={id} task={task} /> }
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

const Task: Component<{id: string, task: Task}> = (props) => {
  // @ts-ignore
  const sortable = createSortable(props.id);

  return (
    <li use:sortable class={styles["task-list_item"]}>
      <div class={styles["handle"]}></div>
      <span>{props.task.name}</span>
    </li>
  )
}