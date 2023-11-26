customElements.define(
  "wp-project",
  class extends HTMLElement {
    constructor() {
      super()
        .attachShadow({ mode: "open" })
        .append(document.getElementById(this.nodeName).content.cloneNode(true));
    }

    connectedCallback() {
      this.shadowRoot.querySelector(".project__button span").innerText =
        localStorage.getItem('activeProject') ?? 'General';
    }
  }
);
