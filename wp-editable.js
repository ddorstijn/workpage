customElements.define(
  "wp-editable",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      node.querySelector('.edit').addEventListener('click', () => this.edit());
      node.querySelector('.delete').addEventListener('click', () => this.delete());

      this.attachShadow({ mode: 'open' }).append(node);
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