[...document.querySelectorAll('ol[sortable]')].forEach(el => {
  console.log(el);
  /** @type {HTMLElement} */
  let draggingEl;
  /** @type {HTMLElement} */
  let placeholder;
  /**@type {boolean} */
  let isDraggingStarted = false;

  let x = 0;
  let y = 0;

  /** @param ev {MouseEvent} */
  const mouseDownHandler = ev => {
    draggingEl = ev.target.getRootNode().host;

    // Calculate the mouse position
    const rect = draggingEl.getBoundingClientRect();
    x = ev.pageX - rect.left;
    y = ev.pageY - rect.top;

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

    const prevEl = draggingEl.previousElementSibling;
    const nextEl = placeholder.nextElementSibling;

    if (prevEl && isAbove(draggingEl, prevEl)) {
      swap(placeholder, draggingEl);
      swap(placeholder, prevEl);
      return;
    }

    if (nextEl && isAbove(nextEl, draggingEl)) {
      swap(nextEl, placeholder);
      swap(nextEl, draggingEl);
    }
  };

  const mouseUpHandler = () => {
    placeholder?.remove();

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

  /** 
   *  @param {HTMLElement} nodeA 
   *  @param {HTMLElement} nodeB  
   */
  function swap(nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    nodeB.parentNode.insertBefore(nodeA, nodeB);
    parentA.insertBefore(nodeB, siblingA);
  }

  /** 
   *  @param {HTMLElement} nodeA 
   *  @param {HTMLElement} nodeB  
   */
  function isAbove(nodeA, nodeB) {
    // Get the bounding rectangle of nodes
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();

    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  };

  // Query all items
  // [...document.querySelectorAll('.draggable')].forEach(item => {
  //   item.shadowRoot.querySelector('.drag-handle').addEventListener('mousedown', mouseDownHandler);
  // });
});