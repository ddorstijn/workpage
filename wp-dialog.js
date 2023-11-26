customElements.define(
  "wp-dialog",
  class extends HTMLElement {
    /** @type {HTMLDialogElement} */
    #dialog;

    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      node.querySelector('header h2').innerText = this.dataset['title'];

      this.#dialog = node.querySelector('dialog');
      this.#dialog.addEventListener('click', event => {
        let rect = this.#dialog.getBoundingClientRect();
        if (event.clientY < rect.top || event.clientY > rect.bottom) return this.#dialog.close();
        if (event.clientX < rect.left || event.clientX > rect.right) return this.#dialog.close();
      });

      this.attachShadow({ mode: 'open' }).append(node);
    }

    showModal() {
      this.#dialog.showModal();
    }

    close() {
      this.#dialog.close();
    }
  },
);