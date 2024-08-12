import { Storage, storage } from "webextension-polyfill";

customElements.define('wp-task-list', class extends HTMLElement {
    #list: HTMLOListElement;

    #changeListener = async (info: Storage.StorageAreaOnChangedChangesType) => {
        if (info[this.dataset.key!]) {
            await this.rerender();
        }
    };

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('task-list-template') as HTMLTemplateElement;
        shadowRoot.appendChild(template.content.cloneNode(true));
        this.#list = shadowRoot.querySelector('.task-list')!;
    }

    async connectedCallback() {
        await this.rerender();

        storage.local.onChanged.addListener(this.#changeListener);
    }

    async rerender() {
        /** @type {string[]} */
        const tasks = (await chrome.storage.sync.get(this.dataset.key!))[this.dataset.key!];
        if (!tasks) return;

        const fragment = document.createDocumentFragment();
        for (const task of tasks) {
            const taskElement = document.createElement("wp-task-item");
            taskElement.dataset.key = task.id;

            fragment.appendChild(taskElement);
        }

        this.#list.replaceChildren(fragment);
    }
})