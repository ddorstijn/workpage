import { PROJECT_KEY } from "../../../../../utils/bookmark.js";

const template = String.raw`
<template id="header-template">
  <style>
    @include '../icons.css';
  </style>

  <header>
    <button>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="m5.176 19.484.14-4.664c-1.476-.218-2.71-.812-3.71-1.78-1-.97-1.497-2.27-1.497-3.895 0-1.336.551-2.625 1.657-3.868C2.87 4.016 4.19 3.383 5.73 3.383c2.258 0 3.387 1.746 3.387 5.238 0 1.024-.062 2.598-.183 4.719-.11 2.101-.164 3.691-.164 4.773 0 1.078.246 1.617.738 1.617.293 0 .715-.293 1.265-.878a9.543 9.543 0 0 0 1.43-1.946c.34-4.133.508-6.601.508-7.406 0-.805-.008-1.355-.024-1.645 0-.293-.015-.578-.046-.851a7.894 7.894 0 0 0-.047-.606 2.35 2.35 0 0 0-.09-.574 3.48 3.48 0 0 0-.094-.41c0-.039-.039-.195-.113-.469a7.892 7.892 0 0 1-.094-.437c.785-.492 2.067-.867 3.848-1.125v.027c.168.64.254 1.563.254 2.77 0 1.191-.153 3.265-.461 6.226-.309 2.965-.461 4.93-.461 5.899 0 .949.23 1.425.691 1.425.477 0 1.043-.492 1.703-1.48.676-.988 1.293-2.277 1.844-3.867.57-1.594.922-3.137 1.063-4.637 0-1.48-.653-3.191-1.961-5.129.3-.777.707-1.488 1.199-2.113.492-.64.906-1.078 1.246-1.317l.504-.382c.57 0 1.055.484 1.453 1.453.414.953.621 2.074.621 3.375 0 1.277-.293 2.933-.875 4.965a38.038 38.038 0 0 1-2.21 5.812c-.876 1.867-1.915 3.465-3.114 4.8-1.18 1.317-2.309 1.977-3.387 1.977-.55 0-1.035-.332-1.45-.988-.413-.66-.628-1.5-.644-2.523-.66 1.097-1.359 1.957-2.097 2.578-.739.621-1.477.933-2.211.933-.738 0-1.352-.359-1.844-1.07-.492-.715-.738-1.59-.738-2.633zm.347-10.808c0-1.133-.093-1.903-.277-2.305-.168-.418-.508-.629-1.016-.629-.492 0-1.066.328-1.726.988-.645.657-.969 1.516-.969 2.579 0 1.058.387 1.937 1.153 2.632.785.696 1.69 1.043 2.718 1.043.078-1.738.117-3.175.117-4.308zm0 0" />
      </svg>
    </button>

    <div class="header__group">
       <wp-header-item data-icon="ph-file-plus" data-title="Add project"> 
        <form method="dialog" id="add-project">
          <input name="name" type="text" />
          <button type="submit">Add</button>
        </form>
      </wp-header-item>

      <wp-header-item data-icon="ph-folder-simple-plus" data-title="Add group"> 
        <form id="add-group">
          <input name="name" type="text" />
          <button type="submit">Add</button>
        </form>
      </wp-header-item>
    </div>

    <div class="header__group">
      <wp-header-item data-icon="ph-download-simple" data-title="Download">
        <form>
          <input name="url" type="url" />
          <button>Download</button>
        </form>
      </wp-header-item>

      <wp-header-item data-icon="ph-upload-simple" data-title="Upload">
        <form>
          <input name="url" type="url" />
          <button>Upload</button>
        </form>
      </wp-header-item>
    </div>

    <div class="header__group">
      <wp-header-item data-icon="ph-translate" data-title="Translate"></wp-header-item>
      <wp-header-item data-icon="ph-palette" data-title="Theme"></wp-header-item>
    </div>
  </header>
</template>
`;

document.head.insertAdjacentHTML('beforeend', template);

customElements.define('wp-header', class extends HTMLElement {
  constructor() {
    super();

    const node = document.getElementById('header-template').content.cloneNode(true);
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(node);
  }

  async connectedCallback() {
    this.shadowRoot.getElementById('add-project').addEventListener('submit', async ev => {
      /** @type {HTMLFormElement} */
      const form = ev.currentTarget;
      const fd = new FormData(form);
      const name = fd.get('name');
      if (!name) return;

      const bookmark = await chrome.bookmarks.create({ title: name, parentId: await getRoot() });
      await chrome.storage.local.set({ [PROJECT_KEY]: bookmark.id });
      form.reset();
    })

    this.shadowRoot.getElementById('add-group').addEventListener('submit', async ev => {
      /** @type {HTMLFormElement} */
      const form = ev.currentTarget;
      const fd = new FormData(form);
      const name = fd.get('name');
      if (!name) return;

      await chrome.bookmarks.create({ title: name, parentId: projectId });
      form.reset();
    });
  }
});