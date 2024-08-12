import { bookmarks } from "webextension-polyfill";

customElements.define(
  "wp-group-item",
  class extends HTMLElement {
    #title: HTMLHeadingElement;
    #links: HTMLElement;

    #changeListener = async (id: string) => {
      if (id !== this.dataset.key) return;
      await this.rerender();
    };

    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: "open" });
      const template = document.getElementById("group-template") as HTMLTemplateElement;
      shadowRoot.appendChild(template.content.cloneNode(true));

      this.#title = shadowRoot.querySelector("h3")!;
      this.#links = shadowRoot.querySelector(".group-links")!;
    }
    async connectedCallback() {
      await this.rerender();

      bookmarks.onChanged.addListener(this.#changeListener);
    }

    disconnectedCallback() {
      bookmarks.onChanged.removeListener(this.#changeListener);
    }

    async rerender() {
      const bookmark = (await bookmarks.getSubTree(this.dataset.key!))[0];
      this.#title.textContent = bookmark.title;

      const links = bookmark.children;
      const fragment = document.createDocumentFragment();
      for (const link of links!) {
        const linkElement = document.createElement("wp-link");
        linkElement.dataset.key = link.id;

        fragment.appendChild(linkElement);
      }

      this.#links.replaceChildren(fragment);
    }
  },
);