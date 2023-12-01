import { sortable } from "../actions/sortable.js";
import { editable } from "../actions/editable.js";

customElements.define(
  "wp-tasks",
  class extends HTMLElement {
    data;
    
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);

      node.querySelector('button').addEventListener('click', () => {
        this.data.push({ name: 'Task'});
        
        let newTask = this.shadowRoot.querySelector('ol').appendChild(document.createElement('wp-task-item'));
        newTask.load({ name: '' });
        newTask.edit();
      });

      this.attachShadow({ mode: 'open' }).append(node);
    }

    load(todo) {
      this.data = todo;
      
      let list = this.shadowRoot.querySelector('ol');
      list.replaceChildren();
      
      this.data.forEach(t => {
        list.appendChild(document.createElement('wp-task-item')).load(t);
      });

      sortable(list, "tasks", () => this.todo = [...this.shadowRoot.querySelectorAll("wp-task-item")].map(
        (taskEl) => taskEl.data
      ));
    }
  }
);

customElements.define(
  "wp-task-item",
  class extends HTMLElement {
    data;

    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      
      this.attachShadow({ mode: 'open' }).append(node);
    }

    load(todo) {
      this.data = todo;

      const name = this.shadowRoot.querySelector('span');
      name.textContent = todo.name;
      editable(this, name, (val) => todo.name = val);
    }
  },
);