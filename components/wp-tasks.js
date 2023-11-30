import { sortable } from "../actions/sortable.js";
import { editable } from "../actions/editable.js";

customElements.define(
  "wp-tasks",
  class extends HTMLElement {
    todos;
    
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);

      node.querySelector('button').addEventListener('click', () => {
        this.todos.push({ name: 'Task'});
      });

      this.attachShadow({ mode: 'open' }).append(node);
    }

    load(todo) {
      this.todos = todo;
      let list = this.shadowRoot.querySelector('ol');
      
      for (const t of todo) {
        const taskEl = document.createElement('wp-task-item');
        taskEl.load(t);  
        list.append(taskEl);
      }

      sortable(list);
    }
  }
);

customElements.define(
  "wp-task-item",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      
      this.attachShadow({ mode: 'open' }).append(node);
    }

    load(todo) {
      const name = this.shadowRoot.querySelector('span');
      name.textContent = todo.name;
      editable(name);
    }
  },
);