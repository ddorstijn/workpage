customElements.define(
  "wp-links",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      const links = node.querySelector('div');
      for (const group of window.project.linkgroups) {
        const groupEl = document.createElement('wp-link-group');
        groupEl.dataset['name'] = group.name;
        groupEl.dataset['color'] = group.color;

        for (const link of group.links) {
          const linkEl = document.createElement('wp-link');
          linkEl.dataset['name'] = link.name;
          linkEl.dataset['url'] = link.url;
          
          groupEl.append(linkEl);
        }

        links.append(groupEl);
      }
      
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
      node.querySelector('h2').innerText = this.dataset['name'];
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
      a.innerText = this.dataset['name'];
      a.href = this.dataset['url'];

      this.attachShadow({ mode: "open" }).append(node);
    }
  }
);
  