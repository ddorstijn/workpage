customElements.define(
    "wp-dialog",
    class extends HTMLElement {
        /** @type {HTMLDialogElement} */
        #dialog;

        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById('wp-dialog').content.cloneNode(true));
        }

        connectedCallback() {
            this.#dialog = this.shadowRoot.querySelector('dialog');
            this.#dialog.addEventListener('click', event => {
                let rect = this.#dialog.getBoundingClientRect();
                if (event.clientY < rect.top || event.clientY > rect.bottom) return this.#dialog.close();
                if (event.clientX < rect.left || event.clientX > rect.right) return this.#dialog.close();
            });

            this.shadowRoot.querySelector('header h2').innerText = this.dataset['title'];
        }

        showModal() {
            this.#dialog.showModal();
        }

        close() {
            this.#dialog.close();
        }
    },
);