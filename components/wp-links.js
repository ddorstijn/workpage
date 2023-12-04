import { editable } from "../actions/editable.js";
import { sortable } from "../actions/sortable.js";

customElements.define(
  "wp-links",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document
        .getElementById(super().nodeName)
        .content.cloneNode(true);

      this.attachShadow({ mode: "open" }).append(node);
    }

    load(linkgroups) {
      sortable(this.shadowRoot.querySelector("ol"), {
        items: linkgroups,
        tagName: 'wp-link-group',
        group: "linkgroup",
        mode: "horizontal"
      });
    }
  }
);

customElements.define(
  "wp-link-group",
  class extends HTMLElement {
    data;
    
    constructor() {
      /** @type {HTMLElement} */
      let node = document
        .getElementById(super().nodeName)
        .content.cloneNode(true);

      this.attachShadow({ mode: "open" }).append(node);
    }

    load(group) {
      this.shadowRoot.querySelector("section").classList.add(group.color);

      let title = this.shadowRoot.querySelector("h2");
      title.innerText = group.name;

      editable(title);
      title.addEventListener("edit", () => (this.draggable = false));
      title.addEventListener("save", () => {
        this.draggable = true;
        group.name = title.innerText;
      });

      sortable(this.shadowRoot.querySelector("ol"), {
        items: group.links,
        tagName: 'wp-link-item',
        group: "links",
        mode: "vertical",
        data: (item) => {
          return {
            type: "text/plain",
            content: item.url,
          };
        }
      });
    }
  }
);

customElements.define(
  "wp-link-item",
  class extends HTMLElement {
    data;

    constructor() {
      /** @type {HTMLElement} */
      let node = document
        .getElementById(super().nodeName)
        .content.cloneNode(true);

      this.attachShadow({ mode: "open" }).append(node);
    }

    load(link) {
      this.data = link;

      let a = this.shadowRoot.querySelector("a");
      a.innerText = link.name;
      a.href = link.url;
    }
  }
);
