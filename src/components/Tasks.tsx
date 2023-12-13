import { Component, For } from "solid-js";
import AddIcon from "~icons/material-symbols/add";
import ChevronLeftIcon from "~icons/material-symbols/chevron-left-rounded";

import styles from "./Tasks.module.css";

const Tasks: Component<{ tasks: Task[] }> = (props) => {
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
        <ol>
          <For each={props.tasks}>
            { (item) => <Task task={item} /> }
          </For>
        </ol>
        <button class={styles["add-task"]}>
          <AddIcon />
          <span>Add a task</span>
        </button>
      </section>
    </details>
  )
}

export default Tasks;

const Task: Component<{task: Task}> = (props) => {
  return (
    <li class={styles["task-list_item"]}>
      <div class={styles["handle"]}></div>
      <span>{props.task.name}</span>
    </li>
  )
}