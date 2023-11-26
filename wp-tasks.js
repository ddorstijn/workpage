customElements.define(
    "wp-tasks",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById(this.nodeName).content.cloneNode(true));
        }
    },
);

customElements.define(
    "wp-task-item",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById(this.nodeName).content.cloneNode(true));
        }
    },
);