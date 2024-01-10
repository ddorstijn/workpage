for (const dialog of document.querySelectorAll('dialog')) {
    dialog.previousElementSibling.addEventListener('click', () => dialog.showModal());
    dialog.querySelector('.dialog__close').addEventListener('click', () => dialog.close());
    for (const el of dialog.querySelectorAll('form *')) {
        el.addEventListener('click', ev => ev.stopPropagation());
    }

    dialog.addEventListener('click', event => {
        const rect = dialog.getBoundingClientRect();
        if (event.clientY < rect.top || event.clientY > rect.bottom) return dialog.close();
        if (event.clientX < rect.left || event.clientX > rect.right) return dialog.close();
    });
}