customElements.define(
  "wp-sortable",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);

      this.attachShadow({ mode: "open" }).append(node);
    }

    connectedCallback() {
      const list = this.shadowRoot.querySelector('ol');

      /** @type {HTMLElement} */
      let draggingEl;
      /** @type {HTMLElement} */
      let placeholder;
      /**@type {boolean} */
      let isDraggingStarted = false;

      let x = 0;
      let y = 0;

      const mouseDownHandler = (e) => {
        draggingEl = e.target;

        // Calculate the mouse position
        const rect = draggingEl.getBoundingClientRect();
        x = e.pageX - rect.left;
        y = e.pageY - rect.top;

        // Attach the listeners to document
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      };

      const mouseMoveHandler = (e) => {
        const draggingRect = draggingEl.getBoundingClientRect();

        if (!isDraggingStarted) {
          isDraggingStarted = true;

          // Let the placeholder take the height of dragging element
          // So the next element won't move up
          placeholder = document.createElement('wp-placeholder');
          draggingEl.parentNode.insertBefore(placeholder, draggingEl.nextSibling);
          placeholder.style.height = draggingRect.height + 'px';
        }

        // Set position for dragging element
        draggingEl.style.position = 'absolute';
        draggingEl.style.top = (e.pageY - y) + 'px';
        draggingEl.style.left = (e.pageX - x) + 'px';

        const prevEle = draggingEl.previousElementSibling;
        const nextEle = placeholder.nextElementSibling;

        if (prevEle && this.isAbove(draggingEl, prevEle)) {
          this.swap(placeholder, draggingEl);
          this.swap(placeholder, prevEle);
          return;
        }

        if (nextEle && this.isAbove(nextEle, draggingEl)) {
          this.swap(nextEle, placeholder);
          this.swap(nextEle, draggingEl);
        }
      };

      const mouseUpHandler = () => {
        // Remove the placeholder
        placeholder && placeholder.parentNode.removeChild(placeholder);

        draggingEl.style.removeProperty('top');
        draggingEl.style.removeProperty('left');
        draggingEl.style.removeProperty('position');

        x = null;
        y = null;
        draggingEl = null;
        isDraggingStarted = false;

        // Remove the handlers of mousemove and mouseup
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      // Query all items
      [...list.querySelectorAll('*')].forEach(function (item) {
        item.addEventListener('mousedown', mouseDownHandler);
      });
    }

    /** 
     *  @param {HTMLElement} nodeA 
     *  @param {HTMLElement} nodeB  
     */
    swap(nodeA, nodeB) {
      const parentA = nodeA.parentNode;
      const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

      nodeB.parentNode.insertBefore(nodeA, nodeB);
      parentA.insertBefore(nodeB, siblingA);
    }

    /** 
     *  @param {HTMLElement} nodeA 
     *  @param {HTMLElement} nodeB  
     */
    isAbove (nodeA, nodeB) {
      // Get the bounding rectangle of nodes
      const rectA = nodeA.getBoundingClientRect();
      const rectB = nodeB.getBoundingClientRect();

      return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
    };
  }
);

customElements.define(
  "wp-placeholder",
  class extends HTMLElement {
    constructor() {
      /** @type {HTMLElement} */
      let node = document.getElementById(super().nodeName).content.cloneNode(true);
      this.attachShadow({ mode: 'open' }).append(node);
    }
  },
);