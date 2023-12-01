/**
 * Initialize element as editable
 * @param {HTMLElement} root The main element where the editable area is part of
 * @param {HTMLElement} el
 * @param {(val: string) => void | undefined} callback
 */
export function editable(root, el, callback) {  
  root.edit = () => {
    if (el.contentEditable == 'true') return;
    
    el.contentEditable = true;
    el.focus();
    document.getSelection()?.collapseToStart();
    
    if (root.draggable) {
      root.freezeDrag = true;
      el.getRootNode().host.draggable = false;
    }
  };

  root.save = () => {
    if (root.freezeDrag) {
      root.freezeDrag = false;
      root.draggable = true;
    }
    
    el.contentEditable = false;

    if (callback) {
      callback(el.textContent);
    }
  };

  el.addEventListener("dblclick", root.edit);
  el.addEventListener("blur", root.save);
  el.addEventListener("keydown", (ev) => {
    if (ev.key == "Enter") {
      ev.preventDefault();
      el.blur();
    }
  });
}
