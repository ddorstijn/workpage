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
    group;

    constructor() {
      /** @type {HTMLElement} */
      let node = document
        .getElementById(super().nodeName)
        .content.cloneNode(true);

      this.attachShadow({ mode: "open" }).append(node);
    }

    load(group) {
      this.group = group;
      console.log(this.group);
      this.shadowRoot.querySelector("section").classList.add(group.color);

      let title = this.shadowRoot.querySelector("h2");
      title.innerText = group.name;
      editable(title, (val) => (group.name = val));

      let list = this.shadowRoot.querySelector("ol");

      for (const link of group.links) {
        const linkEl = document.createElement("wp-link-group-item");
        linkEl.load(link);
        list.append(linkEl);
      }

      sortable(
        list,
        (el) => {
          let json = [...el.querySelectorAll("wp-link-group-item")].map(
            (linkEl) => {
              return linkEl.link;
            }
          );

          this.group.links = json;
        },
        "links",
        (el) => {
          return {
            type: "text/plain",
            content: el.link.url,
          };
        }
      );
    }
  }
);

customElements.define(
  "wp-link-group-item",
  class extends HTMLElement {
    link;

    constructor() {
      /** @type {HTMLElement} */
      let node = document
        .getElementById(super().nodeName)
        .content.cloneNode(true);

      this.attachShadow({ mode: "open" }).append(node);
    }

    load(link) {
      this.link = link;

      let a = this.shadowRoot.querySelector("a");
      a.innerText = link.name;
      a.href = link.url;
    }
  }
);
