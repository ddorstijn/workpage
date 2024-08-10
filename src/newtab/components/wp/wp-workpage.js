import { createDefaultProject, getRoot } from "../../../../utils/bookmark.js";

const template = String.raw`
<template id="workpage-template">
  <wp-header></wp-header>
  <main>
    <wp-clock></wp-clock>
    <wp-project></wp-project>
    <wp-links></wp-links>
  </main>

  <details class="task-drawer">
    <summary>
      <span>Tasks</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="m10.8 12l3.9 3.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.212-.325T8.425 12q0-.2.063-.375T8.7 11.3l4.6-4.6q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7L10.8 12Z" />
      </svg>
    </summary>
    <section class="tasks">
      <wp-task-list></wp-task-list>
    </section>
  </details>
</template>
`;

document.head.insertAdjacentHTML("beforeend", template);

customElements.define("wp-workpage", class extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        getRoot().then((root) => {
            this.dataset.key = root.id;

            const node = document.getElementById("workpage-template").content.cloneNode(true);
            shadowRoot.appendChild(node);

            chrome.bookmarks.getChildren(root.id).then((projects) => {
                if (projects.length === 0) {
                    createDefaultProject(root.id);
                }
            });
        })
    }
});