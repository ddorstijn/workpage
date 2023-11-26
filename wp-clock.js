customElements.define(
  "wp-clock",
  class extends HTMLElement {
    /** @type {HTMLTimeElement} */
    #time;
    /** @type {HTMLTimeElement} */
    #date;

    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      this.#time = node.querySelector('.clock_time');
      this.#date = node.querySelector('.clock_date');

      this.update();

      this.attachShadow({ mode: 'open' }).append(node);
    }

    connectedCallback() {
      setInterval(() => this.update(), 5000);
    }

    update() {
      let now = new Date();
      let timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      this.#time.dateTime = timeStr;
      this.#time.innerText = timeStr;

      let dateStr = now.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
      this.#date.dateTime = now;
      this.#date.innerText = dateStr;
    }
  },
);