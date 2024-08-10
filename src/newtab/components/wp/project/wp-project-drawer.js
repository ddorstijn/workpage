import { getCurrentProject, PROJECT_KEY } from "../../../../../utils/bookmark.js";

const template = String.raw`
<template id="project-template">
    <ut-dialog data-title="Projects">
      <button slot="button">
        <span></span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062Z" />
        </svg>
      </button>
      <div id="project-list">
      </div>
    </ut-dialog>
  </template>
`;

document.head.insertAdjacentHTML("beforeend", template);

customElements.define(
  "wp-project",
  class extends HTMLElement {
    #button;

    #changeListener = async (info) => {
      if (info[PROJECT_KEY]) {
        this.rerender();
      };
    };

    #createdListener = async (_, bookmark) => {
      if (bookmark.parentId === document.querySelector('wp-workpage').dataset.key) {
        await this.rerender();
      }
    }

    #removedListener = async (_, info) => {
      if (info.parentId === document.querySelector('wp-workpage').dataset.key) {
        await this.rerender();
      }
    }

    constructor() {
      super();

      const node = document.getElementById("project-template").content.cloneNode(true);
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(node);

      this.#button = shadowRoot.querySelector('button > span');
    }

    async connectedCallback() {
      await this.rerender();

      chrome.storage.local.onChanged.addListener(this.#changeListener);
      chrome.bookmarks.onCreated.addListener(this.#createdListener);
      chrome.bookmarks.onRemoved.addListener(this.#removedListener);
    }

    disconnectedCallback() {
      chrome.storage.local.onChanged.removeListener(this.#changeListener);
      chrome.bookmarks.onCreated.removeListener(this.#createdListener);
      chrome.bookmarks.onRemoved.removeListener(this.#removedListener);
    }

    async rerender() {
      const project = await getCurrentProject();
      this.#button.textContent = project?.title;

      const projects = await chrome.bookmarks.getChildren(document.querySelector('wp-workpage').dataset.key);
      const fragment = document.createDocumentFragment();
      for (const project of projects) {
        const projectElement = document.createElement("wp-project-item");
        projectElement.dataset.key = project.id;
        fragment.appendChild(projectElement);
      }

      this.shadowRoot.querySelector("#project-list").replaceChildren(fragment);
    }
  }
)