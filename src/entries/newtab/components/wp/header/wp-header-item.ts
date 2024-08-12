customElements.define('wp-header-item', class extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    const template = document.getElementById('header-item-template') as HTMLTemplateElement;
    shadowRoot.appendChild(template.content.cloneNode(true));

    (shadowRoot!.querySelector('#icon')! as HTMLElement).dataset.icon = this.dataset.icon;
    shadowRoot!.querySelector('#title')!.textContent = this.dataset.title ?? null;
  }
})