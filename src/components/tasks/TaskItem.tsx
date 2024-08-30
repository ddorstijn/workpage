import { Component } from "solid-js";
import { draggable } from "~/shared/js/sortable";
import { type Task } from "./Tasks";

import { Options } from "../util/Options";

import "./TaskItem.css";

interface Props {
  task: Task;
  update: (task: Task) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const TaskItem: Component<Props> = (props) => {
  let inputEl: HTMLTextAreaElement | undefined;
  let titleEl: HTMLSpanElement | undefined;

  async function edit() {
    titleEl?.classList.add("hidden");
    inputEl?.classList.remove("hidden");
    inputEl?.focus();
  }

  function initDraggable(el: HTMLElement) {
    draggable({ el });
  }

  async function update() {
    await props.update({ ...props.task, title: inputEl!.value });

    titleEl?.classList.remove("hidden");
    inputEl?.classList.add("hidden");
  }

  async function complete() {
    await props.update({ ...props.task, completed: Date.now() });
  }

  async function remove() {
    await props.remove(props.task.id);
  }

  return (
    <li id={props.task.id} class="task-item" ref={initDraggable}>
      <label class="checkbox">
        <input
          type="checkbox"
          checked={props.task.completed !== undefined}
          onChange={complete}
        />
        <span class="unchecked">
          <i class="ph ph-circle"></i>
        </span>
        <span class="checked">
          <i class="ph ph-check-circle"></i>
        </span>
      </label>
      <Options edit={edit} remove={remove}>
        <span ref={titleEl} class="task-item__title">
          {props.task.title}
        </span>
        <textarea
          name="task-item__input"
          class="task-item__input hidden"
          value={props.task.title}
          ref={inputEl}
          onBlur={update}
          onKeyDown={(event) => event.key === "Enter" && inputEl?.blur()}
        ></textarea>
      </Options>
    </li>
  );
};
