/**
 * Initialize element as editable
 * @param {HTMLElement} el 
 */
function editable(el) {
    el.addEventListener('dblclick', ev => { el.contentEditable = true; el.focus()})
    el.addEventListener('blur', ev => el.contentEditable = false);
    el.addEventListener('keydown', ev => {
        if (ev.key == 'Enter') {
            ev.preventDefault();
            el.blur();
        } 
    });
}