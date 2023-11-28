customElements.define(
  "wp-sortable",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);

      node.querySelector('ol').addEventListener('dragover', ev => {
        ev.preventDefault();

        /** @type {HTMLElement[]} */
        const siblings = [...this.querySelectorAll(':not(.dragging)')];
        const next = siblings.find(s => {
          return ev.clientY <= s.offsetTop + s.offsetHeight / 2;
        });

        const dragging = this.querySelector('.dragging');
        this.insertBefore(dragging, next);
      })
      
      this.attachShadow({ mode: "open" }).append(node);
    }

    connectedCallback() {
      /** @type {HTMLElement[]} */
      let elements = this.querySelectorAll('*');
      for (const el of elements) {
        el.draggable = true;

        el.addEventListener('dragstart', () => setTimeout(el.classList.add('dragging')));
        el.addEventListener('dragover', ev => ev.preventDefault());
        el.addEventListener('drop', ev => ev.preventDefault());
        el.addEventListener('dragend', () => el.classList.remove('dragging'));
      }
    }
  }
);