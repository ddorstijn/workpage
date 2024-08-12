import { bookmarks } from "webextension-polyfill";

customElements.define(
  "wp-link",
  class extends HTMLElement {
    #anchor: HTMLAnchorElement;

    #changeListener = async (id: string) => {
      if (id !== this.dataset.key) return;

      await this.rerender()
    };

    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: "open" });
      const template = document.getElementById("link-template") as HTMLTemplateElement;
      shadowRoot.appendChild(template.content.cloneNode(true));

      this.#anchor = shadowRoot.querySelector("a")!;
    }

    async connectedCallback() {
      await this.rerender();

      bookmarks.onChanged.addListener(this.#changeListener);
    }

    disconnectedCallback() {
      bookmarks.onChanged.removeListener(this.#changeListener);
    }

    async rerender() {
      const bookmark = await bookmarks.get(this.dataset.key!);
      this.#anchor.textContent = bookmark[0].title;
      this.#anchor.href = bookmark[0].url!;
    }
  },
);