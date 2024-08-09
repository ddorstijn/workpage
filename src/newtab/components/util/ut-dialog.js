const template = String.raw`
<template id="dialog-template">
    <style>
      dialog {
        background: none;
        padding: 0;
        border: none;

        >div {
          background: pink;

          >header {
            display: flex;
          }
        }
      }
    </style>
    <div>
      <slot name="button">
        <button>
          Open dialog
        </button>
      </slot>
      <dialog>
        <div>
          <header>
            <h2 id="dialog__title"></h2>
            <button id="dialog__close">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275L12 13.4Z" />
              </svg>
            </button>
          </header>
          <slot><span>My default text</span></slot>
        </div>
      </dialog>
    </div>
  </template>
`;

document.head.insertAdjacentHTML("beforeend", template);

customElements.define(
    "ut-dialog",
    class extends HTMLElement {
        #dialog;

        constructor() {
            super();

            const node = document.getElementById("dialog-template").content.cloneNode(true);
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(node);
            shadowRoot.querySelector('#dialog__title').textContent = this.dataset.title;
            this.#dialog = shadowRoot.querySelector('dialog');
            this.#dialog.addEventListener('click', event => {
                if (event.target === this.#dialog) {
                    this.#dialog.close();
                }
            });

            shadowRoot.querySelector('#dialog__close').addEventListener('click', () => {
                this.#dialog.close();
            });
        }

        connectedCallback() {
            /** @type {HTMLSlotElement} */
            const slot = this.shadowRoot.querySelector('slot[name="button"]');
            const button = slot.assignedElements()[0] ?? slot.firstElementChild;
            button?.addEventListener('click', () => { this.#dialog?.showModal() });
        }
    }
);