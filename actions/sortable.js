/** @type {HTMLElement} */
var draggingEl;

/**
 * Make a sortable list. Calls optional save method on list after move
 * @param {HTMLOListElement} listEl
 * @param {{ items: object[], tagName: string, group: string, mode: "horizontal" | "vertical", data: (item) => {type: string, content: string}? }} options 
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
      
      let dataObj = options.items.splice(options.items.indexOf(item), 1)[0];
      ev.dataTransfer.setData('application/json', JSON.stringify(dataObj));

      childEl.classList.add("dragging");
      draggingEl = childEl;

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
      listEl.append(draggingEl);
    } else {
      listEl.insertBefore(draggingEl, lastEl);
    }

    return true;
  });

  listEl.addEventListener('drop', ev => {
    ev.stopPropagation();

    const dropIndex = [...listEl.children].indexOf(draggingEl);
    const dataObj = JSON.parse(ev.dataTransfer.getData('application/json'));
    options.items.splice(dropIndex, 0, dataObj);
    draggingEl = null;
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
