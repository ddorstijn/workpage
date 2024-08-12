customElements.define('ut-icon', class extends HTMLElement {
    static observedAttributes = ["data-icon"];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.getElementById('icon-template') as HTMLTemplateElement;
        this.shadowRoot!.appendChild(template.content.cloneNode(true));
    }

    attributeChangedCallback() {
        this.shadowRoot!.querySelector('i')!.classList.add(this.dataset.icon!);
    }
});