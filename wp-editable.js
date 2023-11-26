customElements.define(
    "wp-editable",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById(this.nodeName).content.cloneNode(true));
        }
    },
);