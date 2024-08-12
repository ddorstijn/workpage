import { bookmarks } from "webextension-polyfill";
import { createDefaultProject, getRoot } from "~/utils/bookmark";

customElements.define("wp-workpage", class extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    getRoot().then((root) => {
      this.dataset.key = root.id;

      const template = document.getElementById("workpage-template")! as HTMLTemplateElement;
      shadowRoot.appendChild(template.content.cloneNode(true));

      bookmarks.getChildren(root.id).then((projects) => {
        if (projects.length === 0) {
          createDefaultProject();
        }
      });
    })
  }
});