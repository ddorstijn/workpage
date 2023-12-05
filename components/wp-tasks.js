import { sortable } from "../actions/sortable.js";
import { editable } from "../actions/editable.js";

customElements.define(
  "wp-tasks",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document
        .getElementById(super().nodeName)
        .content.cloneNode(true);

      let open = localStorage.getItem("task-open") == "true";
      let details = node.querySelector("details");
      details.open = open;
      details.addEventListener("toggle", () =>
        localStorage.setItem("task-open", details.open)
      );

      this.attachShadow({ mode: "open" }).append(node);
    }

    /**
     *
     * @param {{name: string}[]} todo
     */
    load(todo) {
      sortable(this.shadowRoot.querySelector("ol"), {
        items: todo,
        tagName: "wp-task-item",
        group: 'tasks',
        mode: "vertical",
      });

      this.shadowRoot.querySelector("button").addEventListener("click", () => {
        todo.push({ name: "Task" });

        let newTask = this.shadowRoot
          .querySelector("ol")
          .appendChild(document.createElement("wp-task-item"));
        newTask.load({ name: "" });
        newTask.edit();
      });
    }
  }
);

customElements.define(
  "wp-task-item",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document
        .getElementById(super().nodeName)
        .content.cloneNode(true);

      this.attachShadow({ mode: "open" }).append(node);
    }

    load(todo) {
      const name = this.shadowRoot.querySelector("span");
      name.textContent = todo.name;

      editable(name);
      name.addEventListener("edit", () => (this.draggable = false));
      name.addEventListener("save", () => {
        this.draggable = true;
        todo.name = name.innerText;
      });
    }

    edit() {
      this.shadowRoot.querySelector("span").edit();
    }
  }
);
