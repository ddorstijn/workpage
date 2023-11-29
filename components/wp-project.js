customElements.define(
  "wp-project",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      let button = node.querySelector('button');
      button.addEventListener('click', () => this.shadowRoot.querySelector('wp-dialog').showModal());
      button.querySelector("span").innerText = localStorage.getItem('activeProject') ?? 'General';

      this.attachShadow({ mode: "open" }).append(node);
    }
  }
);
