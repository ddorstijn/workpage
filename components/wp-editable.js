customElements.define(
  "wp-editable",
  class extends HTMLElement {
    /** @type {HTMLElement} */
    #input;

    /** @type {HTMLDivElement} */
    #actions;
    
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      node.querySelector('.delete').addEventListener('click', ev => this.delete(ev));
      node.querySelector('.edit').addEventListener('click', ev => this.edit(ev));
      
      this.#actions = node.querySelector('.actions');

      this.attachShadow({ mode: 'open' }).append(node);
    }
    
    connectedCallback() {
      this.#input = this.shadowRoot.querySelector('slot').assignedElements()[0];
      this.#input.addEventListener('blur', _ => this.blur());
      this.#input.addEventListener('keydown', ev => this.keydown(ev));
    }
    
    edit(ev) {
      ev.stopPropagation();
      this.#actions.hidden = true;

      this.#input.contentEditable = true;
      this.#input.focus();
    }

    delete(ev) {
      ev.stopPropagation();
      this.dispatchEvent(new Event('delete'));
    }

    blur() {
      this.#input.contentEditable = false;
      this.#actions.hidden = false;
    }

    keydown(ev) {
      if (ev.key == 'Enter') {
        ev.preventDefault();
        this.#input.blur();
      } 
    }
  },
);