customElements.define(
  "wp-tasks",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
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
      this.attachShadow({ mode: 'open' }).append(node);
    }
  },
);