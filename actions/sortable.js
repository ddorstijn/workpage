/** @type {HTMLElement} */
var draggingEl;

/** @type {HTMLOListElement} */
var startList;

/**
 * Make a sortable list. Calls optional save method on list after move
 * @param {HTMLOListElement} listEl
 * @param {string} group Group for filtering dropzones
 * @param {"horizontal" | "vertical"} mode
 * @param {(el: HTMLElement) => {type: string, content: any}?} data
 */
export async function sortable(listEl, group, mode = "vertical", data) {
  listEl.addEventListener("dragover", (ev) => {
    ev.stopPropagation();
    let itemGroup = ev.dataTransfer.getData("group");
    if (group && itemGroup && group != itemGroup) {
      return false;
    }

    ev.preventDefault();

    const mousePos = mode == "vertical" ? ev.clientY : ev.clientX;
    const lastEl = insertBefore(listEl, mousePos, mode);
    if (!lastEl) {
      listEl.append(draggingEl);
    } else {
      listEl.insertBefore(draggingEl, lastEl);
    }
  });

  listEl.querySelectorAll("*").forEach((/** @type {HTMLElement} */ childEl) => {
    childEl.draggable = true;
    childEl.addEventListener("dragstart", (ev) => {
      ev.stopPropagation();
      startList = childEl.parentElement;
      childEl.classList.add("dragging");
      draggingEl = childEl;

      if (group) {
        ev.dataTransfer.setData("group", group);
      }

      if (data) {
        let d = data(childEl);
        ev.dataTransfer.setData(d.type, d.content);
      }
    });

    childEl.addEventListener("dragend", (ev) => {
      ev.stopPropagation();
      childEl.classList.remove("dragging");
      draggingEl = null;

      startList.dispatchEvent(new Event("save"));

      const endList = childEl.parentElement;
      if (startList != endList) {
        endList.dispatchEvent(new Event("save"));
      }
    });
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
  return Array.from(
    listEl.querySelectorAll(":scope > [draggable]:not(.dragging)")
  ).reduce((closest, el) => {
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
