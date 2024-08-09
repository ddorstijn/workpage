import { setCurrentProject } from "../../../../../utils/bookmark.js";

const template = String.raw`
<template id="project-item-template">
    <button>
        <span></span>
    </button>
</template>
`;

document.head.insertAdjacentHTML("beforeend", template);

customElements.define(
    "wp-project-item",
    class extends HTMLElement {
        #changeListener = async (id) => {
            if (id !== this.dataset.key) return;

            await this.rerender();
        };

        constructor() {
            super();

            const node = document.getElementById("project-item-template").content.cloneNode(true);
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(node);
        }

        async connectedCallback() {
            await this.rerender();

            this.shadowRoot.querySelector('button').addEventListener('click', async () => {
                await setCurrentProject(this.dataset.key);
            });

            chrome.bookmarks.onChanged.addListener(this.#changeListener);
        }

        async rerender() {
            const project = (await chrome.bookmarks.get(this.dataset.key))[0];
            if (!project) return;

            this.shadowRoot.querySelector("span").textContent = project.title;
        }
    }
)