customElements.define(
  "wp-sortable",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);

      node.querySelector('ol').addEventListener('dragover', ev => {
        /** @type {HTMLElement[]} */
        const siblings = this.shadowRoot.querySelector('slot').assignedElements().filter(el => el instanceof HTMLElement && !el.classList.contains('dragging'));
        const next = siblings.find(s => {
          return ev.clientY <= s.offsetTop + s.offsetHeight / 2;
        });

        const dragging = this.shadowRoot.querySelector('slot').assignedElements().filter(el => el instanceof HTMLElement && el.classList.contains('dragging'));
        this.shadowRoot.querySelector('slot').insertBefore(next, dragging);
      })
      
      this.attachShadow({ mode: "open" }).append(node);
    }

    connectedCallback() {
      /** @type {HTMLElement[]} */
      let elements = this.shadowRoot.querySelector('slot').assignedElements().filter(el => el instanceof HTMLElement);
      for (const el of elements) {
        el.draggable = true;

        el.addEventListener('dragstart', () => setTimeout(el.classList.add('dragging')));
        el.addEventListener('dragend', () => el.classList.remove('dragging'));
      }
    }
  }
);