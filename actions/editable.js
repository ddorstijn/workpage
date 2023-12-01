/**
 * Initialize element as editable
 * @param {HTMLElement} el
 */
export function editable(el) {  
  el.edit = () => {
    el.contentEditable = true;
    el.focus();
    el.dispatchEvent(new Event('edit'));
  };

  el.save = () => {    
    el.contentEditable = false;
    el.dispatchEvent(new Event('save'));
  };

  el.addEventListener("dblclick", el.edit);
  el.addEventListener("blur", el.save);
  el.addEventListener("keydown", (ev) => {
    if (ev.key == "Enter") {
      ev.preventDefault();
      el.blur();
    }
  });
}
