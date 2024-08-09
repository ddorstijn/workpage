const template = String.raw`
<template id="clock-template">
  <h1 class="clock_time"><time class="time"></time></h1>
  <p class="clock_date"><time class="date"></time></p>
</template>
`;

document.head.insertAdjacentHTML("beforeend", template);

customElements.define(
  "wp-clock", class extends HTMLElement {
  constructor() {
    super();

    const node = document.getElementById("clock-template").content.cloneNode(true);
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(node);
  }

  connectedCallback() {
    this.rerender();
    setInterval(this.rerender.bind(this), 5000);
  }

  rerender() {
    var time = this.shadowRoot.querySelector('.clock_time');
    var date = this.shadowRoot.querySelector('.clock_date');

    let now = new Date();
    let timeStr = now.toLocaleTimeString('en-gb', { hour: '2-digit', minute: '2-digit' })
    time.dateTime = timeStr;
    time.innerText = timeStr;

    let dateStr = now.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    date.dateTime = now;
    date.innerText = dateStr;
  }
})
