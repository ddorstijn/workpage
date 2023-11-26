customElements.define(
    "wp-editable",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById('wp-editable').content.cloneNode(true));
        }
    },
);