const menuItems = [
  [
        {
          title: "Add project",
          icon: `<svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="currentColor" d="M5 8h8.45H13h.35H5Zm11 0h3h-3ZM5.4 6h13.2l-.85-1H6.25L5.4 6Zm4.6 6.75l2-1l2 1V8h-4v4.75ZM14.55 21H5q-.825 0-1.413-.588T3 19V6.525q0-.35.113-.675t.337-.6L4.7 3.725q.275-.35.687-.538T6.25 3h11.5q.45 0 .863.188t.687.537l1.25 1.525q.225.275.338.6t.112.675v4.9q-.475-.175-.975-.275T19 11.05V8h-3v3.825q-.875.5-1.525 1.238t-1.025 1.662L12 14l-2.55 1.275q-.5.25-.975-.037T8 14.375V8H5v11h8.35q.2.575.5 1.075t.7.925ZM19 21q-.425 0-.713-.288T18 20v-2h-2q-.425 0-.713-.288T15 17q0-.425.288-.713T16 16h2v-2q0-.425.288-.713T19 13q.425 0 .713.288T20 14v2h2q.425 0 .713.288T23 17q0 .425-.288.713T22 18h-2v2q0 .425-.288.713T19 21ZM5 8h8.45H13h.35H5Z" /> </svg>`,
          handler() {

          },
        },

        {
          title: "Add group",
          icon: `<svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="currentColor" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v6.7q-.475-.225-.975-.388T19 11.075V5H5v14h6.05q.075.55.238 1.05t.387.95H5Zm0-3v1V5v6.075V11v7Zm2-2q0 .425.288.713T8 17h3.075q.075-.525.238-1.025t.362-.975H8q-.425 0-.713.288T7 16Zm0-4q0 .425.288.713T8 13h5.1q.8-.75 1.788-1.25T17 11.075q-.225-.05-.5-.063T16 11H8q-.425 0-.713.288T7 12Zm0-4q0 .425.288.713T8 9h8q.425 0 .713-.288T17 8q0-.425-.288-.713T16 7H8q-.425 0-.713.288T7 8Zm11 15q-2.075 0-3.538-1.463T13 18q0-2.075 1.463-3.538T18 13q2.075 0 3.538 1.463T23 18q0 2.075-1.463 3.538T18 23Zm-.5-4.5v2q0 .2.15.35T18 21q.2 0 .35-.15t.15-.35v-2h2q.2 0 .35-.15T21 18q0-.2-.15-.35t-.35-.15h-2v-2q0-.2-.15-.35T18 15q-.2 0-.35.15t-.15.35v2h-2q-.2 0-.35.15T15 18q0 .2.15.35t.35.15h2Z" /> </svg>`,
          handler() {

          },
        },

        {
          title: "Add link",
          icon: `<svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="currentColor" d="m12 18l-4.2 1.8q-1 .425-1.9-.163T5 17.976V5q0-.825.588-1.413T7 3h6v2H7v12.95l5-2.15l5 2.15V11h2v6.975q0 1.075-.9 1.663t-1.9.162L12 18Zm0-13H7h6h-1Zm5 2h-1q-.425 0-.713-.288T15 6q0-.425.288-.713T16 5h1V4q0-.425.288-.713T18 3q.425 0 .713.288T19 4v1h1q.425 0 .713.288T21 6q0 .425-.288.713T20 7h-1v1q0 .425-.288.713T18 9q-.425 0-.713-.288T17 8V7Z" /> </svg>`,
          handler() {

          },
        },
      ],
      [
        {
          title: "Download",
          icon: `<svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="currentColor" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11l-5 5Zm-6 4q-.825 0-1.413-.588T4 18v-3h2v3h12v-3h2v3q0 .825-.588 1.413T18 20H6Z" /> </svg>`,
          handler() {

          },
        },
        {
          title: "Upload",
          icon: `<svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="currentColor" d="M6 20q-.825 0-1.413-.588T4 18v-2q0-.425.288-.713T5 15q.425 0 .713.288T6 16v2h12v-2q0-.425.288-.713T19 15q.425 0 .713.288T20 16v2q0 .825-.588 1.413T18 20H6Zm5-12.15L9.125 9.725q-.3.3-.713.288T7.7 9.7q-.275-.3-.288-.7t.288-.7l3.6-3.6q.15-.15.325-.212T12 4.425q.2 0 .375.063t.325.212l3.6 3.6q.3.3.288.7t-.288.7q-.3.3-.713.313t-.712-.288L13 7.85V15q0 .425-.288.713T12 16q-.425 0-.713-.288T11 15V7.85Z" /> </svg>`,
          handler() {

          },
        },
      ],
      [
        {
          title: "Translate",
          icon: `<svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="currentColor" d="m15.1 18.95l-.875 2.425q-.1.275-.35.45t-.55.175q-.5 0-.812-.413t-.113-.912l3.8-10.05q.125-.275.375-.45t.55-.175h.75q.3 0 .55.175t.375.45L22.6 20.7q.2.475-.1.888t-.8.412q-.325 0-.562-.188t-.363-.487l-.825-2.375H15.1Zm.6-1.75h3.6l-1.75-4.95h-.1L15.7 17.2ZM9 14l-4.3 4.3q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.35-4.35q-.95-1.05-1.663-2.175T4.75 8h2.1q.45.9.963 1.625T9.05 11.15q1.1-1.2 1.825-2.463T12.1 6H2q-.425 0-.713-.288T1 5q0-.425.288-.713T2 4h6V3q0-.425.288-.713T9 2q.425 0 .713.288T10 3v1h6q.425 0 .713.288T17 5q0 .425-.288.713T16 6h-1.9q-.525 1.775-1.425 3.45T10.45 12.6l2.4 2.45l-.75 2.05L9 14Z" /> </svg>`,
          handler() {

          },
        },
        {
          title: "Switch themes",
          icon: `<svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="currentColor" d="M12 22q-2.05 0-3.875-.788t-3.188-2.15q-1.362-1.362-2.15-3.187T2 12q0-2.075.813-3.9t2.2-3.175Q6.4 3.575 8.25 2.788T12.2 2q2 0 3.775.688t3.113 1.9q1.337 1.212 2.125 2.875T22 11.05q0 2.875-1.75 4.413T16 17h-1.85q-.225 0-.313.125t-.087.275q0 .3.375.863t.375 1.287q0 1.25-.688 1.85T12 22Zm0-10Zm-5.5 1q.65 0 1.075-.425T8 11.5q0-.65-.425-1.075T6.5 10q-.65 0-1.075.425T5 11.5q0 .65.425 1.075T6.5 13Zm3-4q.65 0 1.075-.425T11 7.5q0-.65-.425-1.075T9.5 6q-.65 0-1.075.425T8 7.5q0 .65.425 1.075T9.5 9Zm5 0q.65 0 1.075-.425T16 7.5q0-.65-.425-1.075T14.5 6q-.65 0-1.075.425T13 7.5q0 .65.425 1.075T14.5 9Zm3 4q.65 0 1.075-.425T19 11.5q0-.65-.425-1.075T17.5 10q-.65 0-1.075.425T16 11.5q0 .65.425 1.075T17.5 13ZM12 20q.225 0 .363-.125t.137-.325q0-.35-.375-.825T11.75 17.3q0-1.05.725-1.675T14.25 15H16q1.65 0 2.825-.963T20 11.05q0-3.025-2.313-5.038T12.2 4Q8.8 4 6.4 6.325T4 12q0 3.325 2.337 5.663T12 20Z" /> </svg>`,
          handler() {

          },
        },
      ],
]


customElements.define(
  "wp-header",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);      

      this.load();
      
      this.attachShadow({ mode: 'open' }).append(node);
    }

    async load() {
      let frag = document.createDocumentFragment();
      await customElements.whenDefined('wp-header-item');

      menuItems.forEach(group => {
        let groupEl = frag.appendChild(document.createElement("wp-header-group"));
        group.forEach(item => groupEl.appendChild(document.createElement("wp-header-item")).load(item));
      });

      this.shadowRoot.querySelector('header').append(frag);
    }
  },
);

customElements.define(
  "wp-header-group",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      this.attachShadow({ mode: 'open' }).append(node);
    }
  },
);

customElements.define(
  "wp-header-item",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);

      this.attachShadow({ mode: 'open' }).append(node);
    }

    /**
     * Load element values
     * @param {{title: string, icon: string, handler: (ev: PointerEvent) => void}} item 
     */
    load(item) {
      this.shadowRoot.querySelector('span').innerText = item.title;
      this.shadowRoot.querySelector('slot[name="icon"]').innerHTML = item.icon;
      this.shadowRoot.querySelector('button').addEventListener('click', () => {
        this.shadowRoot.querySelector('wp-dialog').showModal();
      });
    }
  },
);