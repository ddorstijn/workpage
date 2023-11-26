customElements.define(
  "wp-editable",
  class extends HTMLElement {
    /** @type {HTMLInputElement} */
    #input;

    /** @type {HTMLElement} */
    #title;
    
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      node.querySelector('.delete').addEventListener('click', () => this.delete());
      node.querySelector('.edit').addEventListener('click', () => this.edit());
      
      this.#input = node.querySelector('input');
      this.#input.addEventListener('blur', (ev) => this.blur(ev));
      this.attachShadow({ mode: 'open' }).append(node);
    }
    
    connectedCallback() {
      this.#title = this.shadowRoot.querySelector('slot').assignedElements()[0];

      this.#input.value = this.#title.innerText;
    }
    
    edit() {
      this.shadowRoot.querySelector('slot').hidden = true;
      this.shadowRoot.querySelector('.actions').hidden = true;

      this.#input.hidden = false;
      this.#input.focus();      
    }

    delete() {
      this.dispatchEvent(new Event('delete'));
    }

    blur(ev) {
      this.#title.innerText = this.#input.value;

      this.shadowRoot.querySelector('slot').hidden = false;
      this.shadowRoot.querySelector('.actions').hidden = false;
    }
  },
);