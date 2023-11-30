/**
 * Make a sortable list
 * @param {HTMLOListElement} listEl 
 * @param {(el: HTMLElement) => void?} callback 
 * @param {{group: string, data: {type: string, content: any}}?} options 
 */
export async function sortable(listEl, callback, options) {
  listEl.addEventListener('dragover', ev => {
    ev.preventDefault();

    const bottomEl = insertAbove(listEl, ev.clientY);
    if (!bottomEl) {
      listEl.append(window.draggingEl);
    } else {
      listEl.insertBefore(window.draggingEl, bottomEl);
    }
  });
  
  listEl.querySelectorAll('*').forEach((/** @type {HTMLElement} */ childEl) => {
    childEl.draggable = true;
    childEl.addEventListener('dragstart', ev => {
      childEl.classList.add('dragging');
      window.draggingEl = childEl;

      if (options?.data) {
        ev.dataTransfer.setData(options.data.type, options.data.content);
      }
    });
    childEl.addEventListener('dragend', ev => {
      childEl.classList.remove('dragging');
      window.draggingEl = null;
      
      if (callback) {
        callback(listEl);
      }
    });
  })
};

/**
 * Insert element above one of child element based on mouseposition
 * @param {HTMLOListElement} listEl List Element
 * @param {number} mouseY Vertical mouse position in the viewport
 * 
 * @returns {HTMLElement?}
 */
function insertAbove(listEl, mouseY) {
  /** @type {HTMLElement[]} */
  const els = Array.from(listEl.querySelectorAll(':scope > [draggable]:not(.dragging)'));
  
  return els.reduce((closest, el) => {
    const { top, height } = el.getBoundingClientRect();
    const offset = mouseY - (top + height / 2.0);
    return (offset < 0 && (!closest || offset > mouseY - closest.getBoundingClientRect().top)) ? el : closest;
  }, null);
}