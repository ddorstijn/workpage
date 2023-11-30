/**
 * Initialize element as editable
 * @param {HTMLElement} el
 * @param {(val: string) => void | undefined} callback
 */
export function editable(el, callback) {  
  let resetDraggable = false;
  
  el.addEventListener("dblclick", (_) => {
    el.contentEditable = true;
    el.focus();
    document.getSelection().collapseToEnd();
    
    if (el.getRootNode().host.draggable) {
      resetDraggable = true;
      el.getRootNode().host.draggable = false;
    }
  });

  el.addEventListener("blur", (_) => {
    if (resetDraggable) {
      el.getRootNode().host.draggable = true;
    }
    
    el.contentEditable = false;

    if (callback) {
      callback(el.textContent);
    }
  });

  el.addEventListener("keydown", (ev) => {
    if (ev.key == "Enter") {
      ev.preventDefault();
      el.blur();
    }
  });
}
