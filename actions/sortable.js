/** @type {HTMLElement} */
var draggingEl;

/** @type {HTMLOListElement} */
var startList;

/**
 * Make a sortable list. Calls optional save method on list after move
 * @param {HTMLOListElement} listEl 
 * @param {string} group Group for filtering dropzones
 * @param {(el: HTMLElement) => {type: string, content: any}?} data 
 */
export async function sortable(listEl, group, data) {
  listEl.addEventListener('dragover', ev => {
    let itemGroup = ev.dataTransfer.getData("group");
    if (group && itemGroup && group != itemGroup) {
      return false;
    }
    
    ev.preventDefault();

    const bottomEl = insertAbove(listEl, ev.clientY);
    if (!bottomEl) {
      listEl.append(draggingEl);
    } else {
      listEl.insertBefore(draggingEl, bottomEl);
    }
  });
  
  listEl.querySelectorAll('*').forEach((/** @type {HTMLElement} */ childEl) => {
    childEl.draggable = true;
    childEl.addEventListener('dragstart', ev => {
      startList = childEl.parentElement;
      childEl.classList.add('dragging');
      draggingEl = childEl;

      if (group) {
        ev.dataTransfer.setData("group", group);
      }

      if (data) {
        let d = data(childEl);
        ev.dataTransfer.setData(d.type, d.content);
      }
    });

    childEl.addEventListener('dragend', _ => {
      childEl.classList.remove('dragging');
      draggingEl = null;

      startList.dispatchEvent(new Event('save'));

      const endList = childEl.parentElement;
      if (startList != endList) {
        endList.dispatchEvent(new Event('save'));
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
