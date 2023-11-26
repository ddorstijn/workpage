customElements.define(
    "wp-clock",
    class extends HTMLElement {
        /** @type {HTMLTimeElement} */
        #time;
        /** @type {HTMLTimeElement} */
        #date;
        
        constructor() {
            super().attachShadow({ mode: 'open' }).append(document.getElementById(this.nodeName).content.cloneNode(true));
        }

        connectedCallback() {            
            /** @type {HTMLTimeElement} */
            this.#time = this.shadowRoot.querySelector('.clock_time');
            /** @type {HTMLTimeElement} */
            this.#date = this.shadowRoot.querySelector('.clock_date');

            this.update();
            
            setInterval(() => this.update(), 5000);
        }

        update() {
            let now = new Date();
            let timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
            this.#time.dateTime = timeStr;
            this.#time.innerText = timeStr;

            let dateStr = now.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric'});
            this.#date.dateTime = now;
            this.#date.innerText = dateStr;
        }
    },
);