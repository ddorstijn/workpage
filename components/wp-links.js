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
      const groupList = this.shadowRoot.querySelector("ol");
      groupList.replaceChildren();
      
      for (const group of linkgroups) {
        const groupEl = document.createElement("wp-link-group");
        groupEl.load(group);
        groupList.append(groupEl);
      }

      sortable(groupList, "linkgroup", "horizontal");
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

      editable(title);
      title.addEventListener("edit", () => (this.draggable = false));
      title.addEventListener("save", () => {
        this.draggable = true;
        group.name = title.innerText;
      });

      let list = this.shadowRoot.querySelector("ol");
      list.replaceChildren();
      group.links.forEach((l) => {
        list.appendChild(document.createElement("wp-link-item")).load(l);
      });

      sortable(list, "links", "vertical", (el) => {
        return {
          type: "text/plain",
          content: el.data.url,
        };
      });

      list.addEventListener("save", () => {
        let children = [...list.querySelectorAll("*")];
        group.links = children.map((linkEl) => linkEl.data);
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
