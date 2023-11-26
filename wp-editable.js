customElements.define(
    "wp-editable",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById(this.nodeName).content.cloneNode(true));
        }

        connectedCallback() {
            this.shadowRoot.querySelector('.edit').addEventListener('click', () => this.edit());
            this.shadowRoot.querySelector('.delete').addEventListener('click', () => this.delete());
        }

        edit() {
            /** @type {HTMLSlotElement} */
            this.shadowRoot.querySelector('slot').hidden = true;
            this.shadowRoot.querySelector('input').hidden = false;
        }

        delete() {
            this.dispatchEvent(new Event('delete'));
        }
    },
);