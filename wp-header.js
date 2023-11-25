customElements.define(
    "wp-header",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById('wp-header').content.cloneNode(true));
        }
    },
);

customElements.define(
    "wp-header-group",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById('wp-header-group').content.cloneNode(true));
        }
    },
);

customElements.define(
    "wp-header-item",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById('wp-header-item').content.cloneNode(true));
        }

        connectedCallback() {
            this.shadowRoot.querySelector('.header-item__title').innerText = this.dataset['title'];
        }
    },
);