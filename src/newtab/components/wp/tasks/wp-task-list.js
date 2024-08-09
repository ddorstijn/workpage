const template = String.raw`
<template id="task-list-template">
    <ol></ol>
</template>
`;

document.head.insertAdjacentHTML('beforeend', template);

customElements.define('wp-task-list', class extends HTMLElement {
    #list;

    #changeListener = async (info) => {
        if (info[this.dataset.key]) {
            await this.rerender();
        }
    };

    constructor() {
        super();

        const node = document.getElementById('task-list-template').content.cloneNode(true);
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(node);
        this.#list = shadowRoot.querySelector('.task-list');
    }

    async connectedCallback() {
        await this.rerender();

        chrome.storage.local.onChanged.addListener(this.#changeListener);
    }

    async rerender() {
        /** @type {string[]} */
        const tasks = (await chrome.storage.sync.get(this.dataset.key))[this.dataset.key];
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