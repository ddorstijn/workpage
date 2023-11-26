customElements.define(
  "wp-project",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      node.querySelector(".project__button span").innerText = localStorage.getItem('activeProject') ?? 'General';

      this.attachShadow({ mode: "open" }).append(node);
    }
  }
);
