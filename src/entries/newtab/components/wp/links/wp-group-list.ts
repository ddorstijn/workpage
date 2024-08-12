import { Bookmarks, bookmarks, Storage, storage } from "webextension-polyfill";
import { getCurrentProjectId, PROJECT_KEY } from "~/utils/bookmark";

customElements.define(
    "wp-links",
    class extends HTMLElement {
        #wrapper: HTMLDivElement;

        #changeListener = async (info: Storage.StorageAreaOnChangedChangesType) => {
            if (info[PROJECT_KEY]) {
                this.rerender();
            };
        };

        #createListener = async (_: string, bookmark: Bookmarks.BookmarkTreeNode) => {
            const projectId = await getCurrentProjectId();
            if (projectId !== bookmark.parentId) return;
            await this.rerender();
        };

        #removeListener = async (_: string, info: Bookmarks.OnRemovedRemoveInfoType) => {
            const projectId = await getCurrentProjectId();
            if (projectId !== info.parentId) return;
            await this.rerender();
        };

        constructor() {
            super();

            const shadowRoot = this.attachShadow({ mode: "open" });
            const template = document.getElementById("links-template") as HTMLTemplateElement;
            shadowRoot.appendChild(template.content.cloneNode(true));

            this.#wrapper = shadowRoot.querySelector("div")!;
        }

        async connectedCallback() {
            await this.rerender();

            storage.local.onChanged.addListener(this.#changeListener);
            bookmarks.onCreated.addListener(this.#createListener);
            bookmarks.onRemoved.addListener(this.#removeListener);
        }

        disconnectedCallback() {
            storage.local.onChanged.removeListener(this.#changeListener);
            bookmarks.onCreated.removeListener(this.#createListener);
            bookmarks.onRemoved.removeListener(this.#removeListener);
        }

        async rerender() {
            const projectId = await getCurrentProjectId();
            if (!projectId) return;

            const groups = await chrome.bookmarks.getChildren(projectId).catch(() => null);
            if (!groups) return;

            const fragment = document.createDocumentFragment();
            for (const group of groups) {
                const groupElement = document.createElement("wp-group-item");
                groupElement.dataset.key = group.id;
                fragment.appendChild(groupElement);
            }

            this.#wrapper.replaceChildren(fragment);
        }
    }
);