customElements.define('ut-options', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.getElementById('options-template') as HTMLTemplateElement;
        this.shadowRoot!.appendChild(template.content.cloneNode(true));
    }
});