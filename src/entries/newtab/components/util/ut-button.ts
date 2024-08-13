customElements.define('ut-button', class extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        const template = document.getElementById("button-template") as HTMLTemplateElement;
        shadowRoot.appendChild(template.content.cloneNode(true));
        const type = this.dataset.type as "submit" | "reset" | "button" ?? "button";
        shadowRoot.querySelector('button')!.type = type;
    }
})