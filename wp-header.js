customElements.define(
    "wp-header",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById(this.nodeName).content.cloneNode(true));
        }
    },
);

customElements.define(
    "wp-header-group",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById(this.nodeName).content.cloneNode(true));
        }
    },
);

customElements.define(
    "wp-header-item",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById(this.nodeName).content.cloneNode(true));
        }

        connectedCallback() {
            this.shadowRoot.querySelector('.header-item__title').innerText = this.dataset['title'];
        }
    },
);