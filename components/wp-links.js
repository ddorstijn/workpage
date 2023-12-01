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
      const links = this.shadowRoot.querySelector("div");
      for (const group of linkgroups) {
        const groupEl = document.createElement("wp-link-group");
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
      let node = document
        .getElementById(super().nodeName)
        .content.cloneNode(true);

      this.attachShadow({ mode: "open" }).append(node);
    }

    load(group) {
      this.shadowRoot.querySelector("section").classList.add(group.color);

      let title = this.shadowRoot.querySelector("h2");
      title.innerText = group.name;
      editable(this, title, (val) => (group.name = val));

      let list = this.shadowRoot.querySelector("ol");
      list.replaceChildren();

      group.links.forEach(l => {
        list.appendChild(document.createElement("wp-link-group-item")).load(l)
      });

      sortable(
        list,
        "links",
        () => this.group.links = [...this.shadowRoot.querySelectorAll("wp-link-group-item")].map(
          (linkEl) => linkEl.data
        ),
        (el) => {
          return {
            type: "text/plain",
            content: el.data.url,
          };
        }
      );
    }
  }
);

customElements.define(
  "wp-link-group-item",
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
