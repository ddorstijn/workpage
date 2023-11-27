customElements.define(
  "wp-editable",
  class extends HTMLElement {
    /** @type {HTMLTextAreaElement} */
    #textarea;

    /** @type {HTMLElement} */
    #title;

    /** @type {HTMLDivElement} */
    #actions;
    
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      node.querySelector('.delete').addEventListener('click', () => this.delete());
      node.querySelector('.edit').addEventListener('click', () => this.edit());
      
      this.#textarea = node.querySelector('textarea');
      this.#actions = node.querySelector('.actions');

      this.#textarea.addEventListener('blur', (ev) => this.blur(ev));
      this.attachShadow({ mode: 'open' }).append(node);
    }
    
    connectedCallback() {
      this.#title = this.shadowRoot.querySelector('slot').assignedElements()[0];

      this.#textarea.value = this.#title.innerText;
    }
    
    edit() {
      this.#title.hidden = true;
      this.#actions.hidden = true;

      this.#textarea.hidden = false;
      this.#textarea.focus();
    }

    delete() {
      this.dispatchEvent(new Event('delete'));
    }

    blur(ev) {
      this.#title.innerText = this.#textarea.value;

      this.#textarea.hidden = true;
      this.#title.hidden = false;
      this.#actions.hidden = false;
    }
  },
);