customElements.define(
    "wp-clock",
    class extends HTMLElement {
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById('wp-clock').content.cloneNode(true));
        }

        connectedCallback() {
            let now = new Date();
            
            /** @type {HTMLTimeElement} */
            let time = this.shadowRoot.querySelector('.clock_time');
            /** @type {HTMLTimeElement} */
            let date = this.shadowRoot.querySelector('.clock_date');

            let timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
            time.dateTime = timeStr;
            time.innerText = timeStr;

            let dateStr = now.toLocaleTimeString(undefined, { day: 'numeric', month: 'short', year: 'numeric'});
            date.dateTime = now;
            date.innerText = dateStr;
        }
    },
);