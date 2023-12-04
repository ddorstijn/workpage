/** 
 * @template T
 * @type {{ el: HTMLElement, source: T[], item: T }?} 
 **/
var dragCtx;

/**
 * Make a sortable list. Calls optional save method on list after move
 * @template T
 * @param {HTMLOListElement} listEl
 * @param {{ items: T[], tagName: string, group: string, mode: "horizontal" | "vertical", data: (item: T) => {type: string, content: string}? }} options 
 */
export async function sortable(listEl, options) {
  // Make sure there are no elements when initializing
  listEl.replaceChildren();
  for (const item of options.items) {
    const childEl = document.createElement(options.tagName);
    
    childEl.load(item);
    childEl.draggable = true;
    childEl.addEventListener("dragstart", (ev) => {
      ev.stopPropagation();
      
      childEl.classList.add("dragging");

      dragCtx = {
        el: childEl,
        source: options.items,
        item: item
      };
      
      ev.dataTransfer.setData("group", options.group);

      if (options.data) {
        let {type, content} = options.data(item);
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
    
    let itemGroup = ev.dataTransfer.getData("group");
    if (options.group && itemGroup && options.group != itemGroup) {
      return false;
    }

    const mousePos = options.mode == "vertical" ? ev.clientY : ev.clientX;
    const lastEl = insertBefore(listEl, mousePos, options.mode);
    if (!lastEl) {
      listEl.append(dragCtx.el);
    } else {
      listEl.insertBefore(dragCtx.el, lastEl);
    }

    return true;
  });

  listEl.addEventListener('drop', ev => {
    ev.stopPropagation();

    // Move item from source array to target array 
    dragCtx.source.splice(dragCtx.source.indexOf(dragCtx.item), 1)[0];

    const dropIndex = [...listEl.children].indexOf(dragCtx.el);
    options.items.splice(dropIndex, 0, dragCtx.item);
    dragCtx = null;
  });
}

/**
 * Insert element above one of child element based on mouse position
 * @param {HTMLOListElement} listEl List Element
 * @param {number} mousePos Mouse position in the viewport
 * @param {'vertical' | 'horizontal'} direction Direction of insertion ('vertical' or 'horizontal')
 *
 * @returns {HTMLElement?}
 */
function insertBefore(listEl, mousePos, direction) {
  return [...listEl.querySelectorAll("[draggable]:not(.dragging)")].reduce((closest, el) => {
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
}
