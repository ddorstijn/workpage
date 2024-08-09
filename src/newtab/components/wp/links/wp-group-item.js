const template = String.raw`
<template id="group-template">
  <style>
    .group-item__header {
      display: flex;
      gap: 2rem;
    }
  </style>
    <div class="group-item">
      <div class="group-item__header">
        <h3 id="group-title"></h3>
        <div class="options">
          <ut-dialog>
            <button slot="button" class="edit"><i class="ph ph-pen" /></button>
            <form method="dialog" id="edit-group-form">
              <label>
                <span>Title</span>
                <input id="edit-group-title" name="title" type="text" />
              </label>
              <button type="submit">Save</button>
            </form>
          </ut-dialog>
          <button class="delete"><i class="ph ph-x"></i></button>
        </div>
      </div>
      <div class="group-links">
      </div>
    </div>
  </template>
`;

document.head.insertAdjacentHTML("beforeend", template);

customElements.define(
  "wp-group-item",
  class extends HTMLElement {
    #title;
    #links;

    #changeListener = async (id) => {
      if (id !== this.dataset.key) return;
      await this.rerender();
    };

    constructor() {
      super();

      const node = document.getElementById("group-template").content.cloneNode(true);
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(node);

      this.#title = shadowRoot.querySelector("h3");
      this.#links = shadowRoot.querySelector(".group-links");
    }
    async connectedCallback() {
      await this.rerender();

      chrome.bookmarks.onChanged.addListener(this.#changeListener);
    }

    disconnectedCallback() {
      chrome.bookmarks.onChanged.removeListener(this.#changeListener);
    }

    async rerender() {
      const bookmark = (await chrome.bookmarks.getSubTree(this.dataset.key))[0];
      this.#title.textContent = bookmark.title;

      const links = bookmark.children;
      const fragment = document.createDocumentFragment();
      for (const link of links) {
        const linkElement = document.createElement("wp-link");
        linkElement.dataset.key = link.id;
        fragment.appendChild(linkElement);
      }

      this.#links.replaceChildren(fragment);
    }
  },
);