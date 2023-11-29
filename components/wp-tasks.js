customElements.define(
  "wp-tasks",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      sortable(node.querySelector('ol'));
      this.attachShadow({ mode: 'open' }).append(node);
    }
  },
);

customElements.define(
  "wp-task-item",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      node.querySelector('span').textContent = this.dataset['name'];
      this.attachShadow({ mode: 'open' }).append(node);
    }
  },
);