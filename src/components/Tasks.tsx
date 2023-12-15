import { Component, useContext } from "solid-js";

import AddIcon from "~icons/material-symbols/add";
import ChevronLeftIcon from "~icons/material-symbols/chevron-left-rounded";

import styles from "./Tasks.module.css";
import { ProjectContext } from "./Context";
import { SortableList } from "./Sortable";

const Tasks: Component = () => {
  let ctx = useContext(ProjectContext); 

  function addTask() {
    let tasks = [...ctx!.project.todo, { name: "" }];
    ctx!.setProject("todo", tasks);
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
        <SortableList list={ctx!.project.todo} callback={(val) => { ctx!.setProject("todo", val)}} component={Task} />
        <button class={styles["add-task"]} onClick={addTask}>
          <AddIcon />
          <span>Add a task</span>
        </button>
      </section>
    </details>
  )
}

export default Tasks;

const Task: Component<{ item: Task }> = (props) => {
  return (
    <div class={styles["task-list_item"]}>
      <div class={styles["handle"]}></div>
      <span>{props.item.name}</span>
    </div>
  )
}