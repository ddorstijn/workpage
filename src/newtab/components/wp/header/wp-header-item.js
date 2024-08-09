const template = String.raw`
<template id="header-item-template">
  <style>
    @include ../icons.css;
  </style>

  <ut-dialog>
    <button slot="button">
      <i id="icon"class="ph"></i>
      <span id="title"></span>
    </button>

    <slot></slot>
  </ut-dialog>
</template>
`;

document.head.insertAdjacentHTML('beforeend', template);

customElements.define('wp-header-item', class extends HTMLElement {
  constructor() {
    super();

    const node = document.getElementById('header-item-template').content.cloneNode(true);
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(node);

    shadowRoot.querySelector('#icon').classList.add(this.dataset.icon);
    shadowRoot.querySelector('#title').textContent = this.dataset.title;
  }
})