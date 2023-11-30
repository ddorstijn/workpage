/**
 * Initialize element as editable
 * @param {HTMLElement} el
 * @param {(val: string) => void | undefined} callback
 */
export function editable(el, callback) {
  el.addEventListener("dblclick", (_) => {
    el.contentEditable = true;
    el.focus();
    document.getSelection().collapseToEnd();
  });

  el.addEventListener("blur", (_) => {
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
