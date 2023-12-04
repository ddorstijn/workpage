/** 
 * @template T
 * @type {{ el: HTMLElement, group: string, source: T[], item: T }?} 
 **/
var dragCtx;

/**
 * Make a sortable list. Calls optional save method on list after move
 * @template T
 * @param {HTMLOListElement} listEl
 * @param {{ items: T[], tagName: string, group: string, mode: "horizontal" | "vertical", data: (item: T) => {type: string, content: string}? }} options 
 */
export async function sortable(listEl, { items, tagName, group, mode, data}) {
  // Make sure there are no elements when initializing
  listEl.replaceChildren();
  for (const item of items) {
    const childEl = document.createElement(tagName);
    childEl.draggable = true;
    
    childEl.load(item);
    childEl.addEventListener("dragstart", (ev) => {
      ev.stopPropagation();
      
      childEl.classList.add("dragging");

      dragCtx = {
        el: childEl,
        group: group,
        source: items,
        item: item
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

    ev.dataTransfer.dropEffect = "move";

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
    dragCtx.source.splice(dragCtx.source.indexOf(dragCtx.item), 1)[0];

    const dropIndex = [...listEl.children].indexOf(dragCtx.el);
    items.splice(dropIndex, 0, dragCtx.item);
    dragCtx = null;
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
  const el = [...listEl.querySelectorAll("[draggable]:not(.dragging)")].reduce((closest, el) => {
    const rect = el.getBoundingClientRect();
    const startPos = direction === "vertical" ? rect.top : rect.left;
    const extent = direction === "vertical" ? rect.height : rect.width;
    const offset = mousePos - (startPos + extent / 2.0);

    return offset < 0 &&
      (closest === null ||
        offset >
          mousePos -
            (direction === "vertical"
              ? closest.getBoundingClientRect().top
              : closest.getBoundingClientRect().left))
      ? el
      : closest;
  }, null);

  if (!el) {
    listEl.append(dragEl);
  } else {
    listEl.insertBefore(dragEl, el);
  }
}
