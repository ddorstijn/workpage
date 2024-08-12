import { bookmarks, storage } from "webextension-polyfill";
import { getCurrentProjectId, PROJECT_KEY } from "~/utils/bookmark";

customElements.define('wp-header', class extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    const template = document.getElementById('header-template') as HTMLTemplateElement;
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    const addProjectBtn = this.shadowRoot!.getElementById('add-project') as HTMLButtonElement;
    addProjectBtn.addEventListener('submit', async ev => {
      const form = ev.currentTarget as HTMLFormElement;
      const fd = new FormData(form);
      const name = fd.get('name') as string;
      if (!name) return;

      const workpageEl = document.querySelector('wp-workpage') as HTMLElement;
      const bookmark = await bookmarks.create({ title: name, parentId: workpageEl.dataset.key });
      await storage.local.set({ [PROJECT_KEY]: bookmark.id });
      form.reset();
    })

    const addGroupBtn = this.shadowRoot!.getElementById('add-group') as HTMLButtonElement;
    addGroupBtn.addEventListener('submit', async ev => {
      const form = ev.currentTarget as HTMLFormElement;
      const fd = new FormData(form);
      const name = fd.get('name') as string;
      if (!name) return;

      await bookmarks.create({ title: name, parentId: await getCurrentProjectId() });
      form.reset();
    });
  }
});