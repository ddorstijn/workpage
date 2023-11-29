customElements.define(
  "wp-links",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      
      this.attachShadow({ mode: "open" }).append(node);
    }
  }
);

customElements.define(
  "wp-link-group",
  class extends HTMLElement {   
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      node.querySelector('h2').innerText = this.dataset['title'];
      node.querySelector("section").classList.add(this.dataset['color']);
      
      this.attachShadow({ mode: "open" }).append(node);
    }
  }
);

customElements.define(
  "wp-link-group-item",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      let a = node.querySelector("a");
      a.innerText = this.dataset['title'];
      a.href = this.dataset['url'];

      this.attachShadow({ mode: "open" }).append(node);
    }
  }
);
  