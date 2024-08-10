import { getCurrentProjectId, PROJECT_KEY } from "../../../../../utils/bookmark.js";

const template = String.raw`
<template id="links-template">
    <style>
        .group-list {
            display: flex;
            gap: 2rem;
        }
    </style>

    <div class="group-list"></div>
</template>
`;

document.head.insertAdjacentHTML("beforeend", template);

customElements.define(
    "wp-links",
    class extends HTMLElement {
        #wrapper;

        #changeListener = async (info) => {
            if (info[PROJECT_KEY]) {
                this.rerender();
            };
        };

        #createListener = async (_, bookmark) => {
            const projectId = await getCurrentProjectId();
            if (projectId !== bookmark.parentId) return;
            await this.rerender();
        };

        #removeListener = async (_, info) => {
            const projectId = await getCurrentProjectId();
            if (projectId !== info.parentId) return;
            await this.rerender();
        };

        constructor() {
            super();

            const node = document.getElementById("links-template").content.cloneNode(true);
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(node);

            this.#wrapper = shadowRoot.querySelector("div");
        }

        async connectedCallback() {
            await this.rerender();

            chrome.storage.local.onChanged.addListener(this.#changeListener);
            chrome.bookmarks.onCreated.addListener(this.#createListener);
            chrome.bookmarks.onRemoved.addListener(this.#removeListener);
        }

        disconnectedCallback() {
            chrome.storage.local.onChanged.removeListener(this.#changeListener);
            chrome.bookmarks.onCreated.removeListener(this.#createListener);
            chrome.bookmarks.onRemoved.removeListener(this.#removeListener);
        }

        async rerender() {
            const projectId = await getCurrentProjectId();
            if (!projectId) return;

            const groups = await chrome.bookmarks.getChildren(projectId);
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