const dialogs = document.querySelectorAll('dialog');
for (const dialog of dialogs) {
    dialog.addEventListener('mousedown', (e) => {
        console.log(e);
        if (e.target != dialog) {
            return;
        }

        dialog.querySelector('form')?.reset();
        dialog.close();
    });
}