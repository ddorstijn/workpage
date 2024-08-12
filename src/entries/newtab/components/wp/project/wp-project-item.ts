import { bookmarks } from "webextension-polyfill";
import { setCurrentProject } from "~/utils/bookmark";

customElements.define(
    "wp-project-item",
    class extends HTMLElement {
        #changeListener = async (id: string) => {
            if (id !== this.dataset.key) return;

            await this.rerender();
        };

        constructor() {
            super();

            const shadowRoot = this.attachShadow({ mode: "open" });
            const template = document.getElementById("project-item-template") as HTMLTemplateElement;
            shadowRoot.appendChild(template.content.cloneNode(true));
        }

        async connectedCallback() {
            await this.rerender();

            this.shadowRoot!.querySelector('button')!.addEventListener('click', async () => {
                await setCurrentProject(this.dataset.key!);
            });

            bookmarks.onChanged.addListener(this.#changeListener);
        }

        async rerender() {
            const project = (await bookmarks.get(this.dataset.key!))[0];
            if (!project) return;

            this.shadowRoot!.querySelector("span")!.textContent = project.title;
        }
    }
)