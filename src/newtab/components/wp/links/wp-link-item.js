const template = String.raw`
<template id="link-template">
    <style>
      .link-item {
        display: flex;
      }
    </style>
  
    <div class="link-item">
      <a></a>
      <div class="options">
        <button class="edit" aria-controls="edit-link-dialog"><i class="ph ph-pen" /></button>
        <dialog id="edit-link-dialog">
          <div>
            <form method="dialog" id="edit-link-form">
              <label>
                <span>Title</span>
                <input name="title" type="text" />
              </label>
              <label>
                <span>URL</span>
                <input name="url" type="text" />
              </label>
              <button type="submit">Save</button>
            </form>
          </div>
        </dialog>
        <button class="delete" onClick={deleteLink}><i class="ph ph-x" /></button>
      </div>
    </div class="link-item">
  </template>
`;

document.head.insertAdjacentHTML("beforeend", template);

customElements.define(
  "wp-link",
  class extends HTMLElement {
    #anchor;

    #changeListener = async (id) => {
      if (id !== this.dataset.key) return;

      await this.rerender()
    };

    constructor() {
      super();

      const node = document.getElementById("link-template").content.cloneNode(true);
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(node);

      this.#anchor = shadowRoot.querySelector("a");
    }

    async connectedCallback() {
      await this.rerender();
      chrome.bookmarks.onChanged.addListener();
    }

    disconnectedCallback() {
      chrome.bookmarks.onChanged.removeListener(this.#changeListener);
    }

    async rerender() {
      const bookmark = await chrome.bookmarks.get(this.dataset.key);
      this.#anchor.textContent = bookmark[0].title;
      this.#anchor.href = bookmark[0].url;
    }
  },
);