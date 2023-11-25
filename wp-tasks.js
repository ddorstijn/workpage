customElements.define(
    "wp-tasks",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById('wp-tasks').content.cloneNode(true));
        }
    },
);

customElements.define(
    "wp-task-item",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById('wp-task-item').content.cloneNode(true));
        }
    },
);