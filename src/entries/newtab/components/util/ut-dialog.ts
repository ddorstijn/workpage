customElements.define(
  "ut-dialog",
  class extends HTMLElement {
    #dialog: HTMLDialogElement;

    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: "open" });
      const template = document.getElementById("dialog-template") as HTMLTemplateElement;
      shadowRoot!.appendChild(template.content.cloneNode(true));

      this.#dialog = shadowRoot.querySelector('dialog')!;
      this.#dialog.querySelector('#dialog__title')!.textContent = this.dataset.title ?? null;
      this.#dialog.addEventListener('click', event => {
        if (event.target === this.#dialog) {
          this.#dialog.close();
        }
      });

      this.#dialog.querySelector('#dialog__close')?.addEventListener('click', () => {
        this.#dialog.close();
      });
    }

    connectedCallback() {
      const slot = this.shadowRoot!.querySelector('slot[name="button"]') as HTMLSlotElement;
      const button = slot.assignedElements()[0] ?? slot.firstElementChild;
      button?.addEventListener('click', () => { this.#dialog.showModal() });
    }
  }
);