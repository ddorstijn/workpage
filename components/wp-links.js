import { editable } from "../actions/editable.js";
import { sortable } from "../actions/sortable.js";

customElements.define(
  "wp-links",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      
      this.attachShadow({ mode: "open" }).append(node);
    }

    load(linkgroups) {
      const links = this.shadowRoot.querySelector('div');
      for (const group of linkgroups) {
        const groupEl = document.createElement('wp-link-group');
        groupEl.load(group);
        links.append(groupEl);
      }
    }
  }
);

customElements.define(
  "wp-link-group",
  class extends HTMLElement {   
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      
      this.attachShadow({ mode: "open" }).append(node);
    }

    load(group) {
      this.shadowRoot.querySelector("section").classList.add(group.color);

      let title = this.shadowRoot.querySelector('h2');
      title.innerText = group.name;
      editable(title, (val) => group.name = val);

      let list = this.shadowRoot.querySelector('ol');
      
      for (const link of group.links) {
        const linkEl = document.createElement('wp-link-group-item');
        linkEl.load(link);  
        list.append(linkEl);
      }

      sortable(list);
    }
  }
);

customElements.define(
  "wp-link-group-item",
  class extends HTMLElement {
    link;
    
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);

      this.attachShadow({ mode: "open" }).append(node);
    }

    load(link) {
      this.link = link;
      
      let a = this.shadowRoot.querySelector("a");
      a.innerText = link.name;
      a.href = link.url;
      
      this.shadowRoot.querySelector('li').addEventListener("dragstart", (event) =>
        event.dataTransfer.setData("text/plain", link.url),
      );
    }
  }
);
  