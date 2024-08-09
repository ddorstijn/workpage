const template = String.raw`
<template id="task-item-template">
    <li>
      <input type="checkbox" />
      <span></span>
    </li>;
</template>
`;

document.head.insertAdjacentHTML('beforeend', template);

customElements.define('wp-task-item', class extends HTMLElement {
    #changeListener = async (info) => {
        if (info[this.dataset.key]) {
            await this.rerender();
        }
    };

    constructor() {
        super();

        const node = document.getElementById('task-item-template').content.cloneNode(true);
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(node);
    }

    async connectedCallback() {
        await this.rerender();
        chrome.storage.local.onChanged.addListener(this.#changeListener);
    }

    async rerender() {
        const task = (await chrome.storage.local.get(this.dataset.key))[this.dataset.key];
        this.shadowRoot.querySelector('span').textContent = task.title;
    }
})