customElements.define(
  "wp-header",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      this.attachShadow({ mode: 'open' }).append(node);
    }
  },
);

customElements.define(
  "wp-header-group",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      this.attachShadow({ mode: 'open' }).append(node);
    }
  },
);

customElements.define(
  "wp-header-item",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      node.querySelector('span').innerText = this.dataset['title'];
      node.querySelector('button').addEventListener('click', () => {
        this.shadowRoot.querySelector('wp-dialog').showModal();
      });

      this.attachShadow({ mode: 'open' }).append(node);
    }
  },
);