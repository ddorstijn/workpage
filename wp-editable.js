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
      node.querySelector('.delete').addEventListener('click', () => this.delete());
      node.querySelector('.edit').addEventListener('click', () => this.edit());
      
      this.#actions = node.querySelector('.actions');

      this.attachShadow({ mode: 'open' }).append(node);
    }
    
    connectedCallback() {
      this.#input = this.shadowRoot.querySelector('slot').assignedElements()[0];
      this.#input.addEventListener('pointermove', ev => ev.stopPropagation());
      this.#input.addEventListener('blur', _ => this.blur());
      this.#input.addEventListener('keydown', ev => this.keydown(ev));
    }
    
    edit() {
      this.#actions.hidden = true;

      this.#input.contentEditable = true;
      this.#input.focus();
    }

    delete() {
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