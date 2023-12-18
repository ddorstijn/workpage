import { Component, useContext } from "solid-js";

import AddIcon from "~icons/material-symbols/add";
import ChevronLeftIcon from "~icons/material-symbols/chevron-left-rounded";
import RemoveIcon from "~icons/material-symbols/close-rounded";

import styles from "./Tasks.module.css";
import { ProjectContext } from "./Context";
import { SortableList } from "./Sortable";
import { editable } from "~/directives/editable";
editable;

const Tasks: Component = () => {
  let ctx = useContext(ProjectContext)!; 
  let sortableList: HTMLOListElement | undefined;

  function addTask() {
    let tasks = [...ctx.project.todo, { name: "New task" }];
    ctx!.setProject("todo", tasks);
    setTimeout(() => {
      let [newTask] = Array.from(sortableList!.children).slice(-1) as HTMLLIElement[];
      let input = newTask.querySelector('span')!;
      input.contentEditable = "true";
    
      window.getSelection()?.selectAllChildren(input);
    });
  }
  
  return (
    <details class={styles["task-drawer"]} open>
      <summary>
        <span>Tasks</span>
        <ChevronLeftIcon />
      </summary>
      <section class={styles["tasks"]}>
        <header>
          <h3 class="active">Todo</h3>
          <h3>Done</h3>
        </header>
        <SortableList ref={sortableList} list={ctx!.project.todo} callback={(val) => { ctx!.setProject("todo", val)}} component={Task} />
        <button class={styles["add-task"]} onClick={addTask}>
          <AddIcon />
          <span>Add a task</span>
        </button>
      </section>
    </details>
  )
}

export default Tasks;

const Task: Component<{ idx: number, item: Task }> = (props) => {
  const ctx = useContext(ProjectContext)!;

  function remove() {
    if (!confirm("Are you sure you want to delete this task?")) return;
    ctx.setProject("todo", ctx.project.todo.filter((_, idx) => idx !== props.idx));
  }
  
  return (
    <div class={styles["task-list_item"]}>
      <div class={styles["handle"]}></div>
      <span use:editable={(val: string) => ctx.setProject("todo", props.idx, "name", val)}>{props.item.name}</span>
      <button onClick={remove}><RemoveIcon /></button>
    </div>
  )
}