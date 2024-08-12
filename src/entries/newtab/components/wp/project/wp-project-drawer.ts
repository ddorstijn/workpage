import { bookmarks, Bookmarks, Storage, storage } from "webextension-polyfill";
import { getCurrentProject, PROJECT_KEY } from "~/utils/bookmark";

customElements.define(
  "wp-project",
  class extends HTMLElement {
    #root: string;
    #button: HTMLSpanElement;

    #changeListener = async (info: Storage.StorageAreaOnChangedChangesType) => {
      if (info[PROJECT_KEY]) {
        this.rerender();
      };
    };

    #createdListener = async (_: string, bookmark: Bookmarks.BookmarkTreeNode) => {
      if (bookmark.parentId === this.#root) {
        await this.rerender();
      }
    }

    #removedListener = async (_: string, info: Bookmarks.OnRemovedRemoveInfoType) => {
      if (info.parentId === this.#root) {
        await this.rerender();
      }
    }

    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: "open" });
      const template = document.getElementById("project-template") as HTMLTemplateElement;
      shadowRoot.appendChild(template.content.cloneNode(true));

      const wpWorkpage = document.querySelector('wp-workpage') as HTMLElement;
      this.#button = shadowRoot.querySelector('button > span')!;
      this.#root = wpWorkpage.dataset.key!;
    }

    async connectedCallback() {
      await this.rerender();

      storage.local.onChanged.addListener(this.#changeListener);
      bookmarks.onCreated.addListener(this.#createdListener);
      bookmarks.onRemoved.addListener(this.#removedListener);
    }

    disconnectedCallback() {
      storage.local.onChanged.removeListener(this.#changeListener);
      bookmarks.onCreated.removeListener(this.#createdListener);
      bookmarks.onRemoved.removeListener(this.#removedListener);
    }

    async rerender() {
      const project = await getCurrentProject();
      this.#button.textContent = project?.title ?? null;

      const projects = await bookmarks.getChildren(this.#root);
      const fragment = document.createDocumentFragment();
      for (const project of projects) {
        const projectElement = document.createElement("wp-project-item");
        projectElement.dataset.key = project.id;
        fragment.appendChild(projectElement);
      }

      this.shadowRoot!.querySelector("#project-list")!.replaceChildren(fragment);
    }
  }
)