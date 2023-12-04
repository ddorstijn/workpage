import { sortable } from "../actions/sortable.js";
import { editable } from "../actions/editable.js";

customElements.define(
  "wp-tasks",
  class extends HTMLElement {
    data;

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

      node.querySelector("button").addEventListener("click", () => {
        this.data.push({ name: "Task" });

        let newTask = this.shadowRoot
          .querySelector("ol")
          .appendChild(document.createElement("wp-task-item"));
        newTask.load({ name: "" });
        newTask.edit();
      });

      this.attachShadow({ mode: "open" }).append(node);
    }

    /**
     *
     * @param {{name: string}[]} todo
     */
    load(todo) {
      this.data = todo;

      let list = this.shadowRoot.querySelector("ol");
      list.replaceChildren();
      todo.forEach((t) => {
        list.appendChild(document.createElement("wp-task-item")).load(t);
      });

      // sortable(list, "tasks");
      list.addEventListener("save", () => {
        todo.length = 0;

        const children = [...list.querySelectorAll("wp-task-item")];
        todo.push(...children.map((taskEl) => taskEl.data));
      });
    }
  }
);

customElements.define(
  "wp-task-item",
  class extends HTMLElement {
    data;

    constructor() {
      /** @type {HTMLElement} */
      let node = document
        .getElementById(super().nodeName)
        .content.cloneNode(true);

      this.attachShadow({ mode: "open" }).append(node);
    }

    load(todo) {
      this.data = todo;

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
