customElements.define(
  "wp-clock", class extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    const template = document.getElementById("clock-template")! as HTMLTemplateElement;
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.rerender();
    setInterval(this.rerender.bind(this), 5000);
  }

  rerender() {
    const time = this.shadowRoot!.querySelector('.clock_time')! as HTMLTimeElement;
    const date = this.shadowRoot!.querySelector('.clock_date')! as HTMLTimeElement;

    let now = new Date();
    let timeStr = now.toLocaleTimeString('en-gb', { hour: '2-digit', minute: '2-digit' })
    time.dateTime = timeStr;
    time.innerText = timeStr;

    let dateStr = now.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    date.dateTime = dateStr;
    date.innerText = dateStr;
  }
})
