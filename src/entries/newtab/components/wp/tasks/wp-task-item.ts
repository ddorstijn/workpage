import { Storage, storage } from "webextension-polyfill";

customElements.define('wp-task-item', class extends HTMLElement {
    #changeListener = async (info: Storage.StorageAreaOnChangedChangesType) => {
        if (info[this.dataset.key!]) {
            await this.rerender();
        }
    };

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('task-item-template') as HTMLTemplateElement;
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    async connectedCallback() {
        await this.rerender();
        storage.local.onChanged.addListener(this.#changeListener);
    }

    async rerender() {
        const task = (await storage.local.get(this.dataset.key!))[this.dataset.key!];
        this.shadowRoot!.querySelector('span')!.textContent = task.title;
    }
})