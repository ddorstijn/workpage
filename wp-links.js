customElements.define(
  "wp-links",
  class extends HTMLElement {
    constructor() {
      super()
        .attachShadow({ mode: "open" })
        .append(document.getElementById(this.nodeName).content.cloneNode(true));
    }
  }
);

customElements.define(
  "wp-link-group",
  class extends HTMLElement {   
    constructor() {
      super()
        .attachShadow({ mode: "open" })
        .append(document.getElementById(this.nodeName).content.cloneNode(true));
    }

    connectedCallback() {
      this.shadowRoot.querySelector("h2").innerText =
        this.dataset['title'];

        this.shadowRoot.querySelector("section").classList.add(this.dataset['color']);
    }
  }
);

customElements.define(
  "wp-link-group-item",
  class extends HTMLElement {
    constructor() {
      super()
        .attachShadow({ mode: "open" })
        .append(document.getElementById(this.nodeName).content.cloneNode(true));
    }

    connectedCallback() {
      let anchor = this.shadowRoot.querySelector("a");
      anchor.innerText = this.dataset['title'];
      anchor.href = this.dataset['url'];
    }
  }
);
  