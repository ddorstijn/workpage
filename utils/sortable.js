/** 
 * @template T
 * @type {{ source: HTMLOListElement, el: HTMLElement, group: string, items: T[] setItems: (items: T[]) => void, item: T }?} 
 **/
var dragCtx;

/**
 * Make a sortable list. Calls optional save method on list after move
 * @template T
 * @param {HTMLOListElement} listEl
 * @param {{ items: T[], template: (item: T) => HTMLElement, group: string, mode: "horizontal" | "vertical", data: (item: T) => {type: string, content: string}? }} options 
 */
export async function sortable(listEl, { items, template, group, mode, data}) {
  // Make sure there are no elements when initializing
  listEl.replaceChildren();
  for (const item of items) {
    const childEl = template(item);
    childEl.draggable = true;
    
    childEl.addEventListener("dragstart", (ev) => {
      ev.stopPropagation();
      
      childEl.classList.add("dragging");

      dragCtx = {
        source: listEl,
        el: childEl,
        group,
        items,
        item
      };
      
      if (data) {
        let {type, content} = data(item);
        ev.dataTransfer.setData(type, content);
      }
    });

    childEl.addEventListener("dragend", (ev) => {
      ev.stopPropagation();
      childEl.classList.remove("dragging");
    });

    listEl.append(childEl);
  }

  listEl.addEventListener("dragover", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    
    if (group && dragCtx.group && group != dragCtx.group) {
      ev.dataTransfer.dropEffect = "none";
      return false;
    }

    const mousePos = mode == "vertical" ? ev.clientY : ev.clientX;
    moveElement(listEl, dragCtx.el, mousePos, mode);

    return true;
  });

  listEl.addEventListener('drop', ev => {
    ev.stopPropagation();

    if (group && dragCtx.group && group != dragCtx.group) {
      return false;
    }

    // Move item from source array to target array 
    dragCtx.items.splice(dragCtx.items.indexOf(dragCtx.item), 1)[0];
    for (let i = 0; i < listEl.children.length; i++) {
      if (dragCtx.el === listEl.children[i]) {
        items.splice(i, 0, dragCtx.item);
        break;
      }
    }
  });
}

/**
 * Insert element above one of child element based on mouse position
 * @param {HTMLOListElement} listEl List Element
 * @param {HTMLElement} dragEl The dragged element
 * @param {number} mousePos Mouse position in the viewport
 * @param {'vertical' | 'horizontal'} direction Direction of insertion ('vertical' or 'horizontal')
 */
function moveElement(listEl, dragEl, mousePos, direction) {
  let closest = null;
  for (const el of listEl.querySelectorAll("[draggable]:not(.dragging)")) {
    const rect = el.getBoundingClientRect();
    const startPos = direction === "vertical" ? rect.top : rect.left;
    const extent = direction === "vertical" ? rect.height : rect.width;
    const offset = mousePos - (startPos + extent / 2.0);

    if (offset >= 0) {
      continue;
    }

    if (!closest) {
      closest = el;
    }
    
    const closestRect = closest.getBoundingClientRect();
    const closestStartPos = direction === "vertical" ? closestRect.top : closestRect.left;
    if (offset > mousePos - closestStartPos) {
      closest = el;
    }
  }

  if (closest) {
    if (dragEl.nextSibling === closest) return;
    listEl.insertBefore(dragEl, closest);
  } else {
    if (listEl.lastChild === dragEl) return;
    listEl.append(dragEl);
  }
}
