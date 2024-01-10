import { initLinks } from "./links.js";
import { initWorkpage } from "./workpage.js";

/**
 * 
 * @param {Project} project 
 */
export function initHeader(project) {
    document.getElementById('add-project').addEventListener('submit', ev => {
        ev.stopImmediatePropagation();
        ev.preventDefault();

        /** @type {HTMLFormElement} */
        const form = ev.currentTarget;

        const fd = new FormData(form);
        const name = fd.get('name');

        if (!name) return;

        chrome.storage.sync.set({
            [name]: {
                used: new Date(),
                todo: [],
                done: [],
                linkgroups: []
            }
        });

        initWorkpage(name);

        form.reset();
    })

    document.getElementById('add-linkgroup').addEventListener('submit', ev => {
        ev.stopImmediatePropagation();
        ev.preventDefault();

        /** @type {HTMLFormElement} */
        const form = ev.currentTarget;

        const fd = new FormData(form);
        const name = fd.get('name');
        const color = fd.get('color');

        if (!name || project.linkgroups.find(l => l.name == name)) return;

        project.linkgroups.push({ name, color, links: [] });
        initLinks(project);

        form.reset();
    });

    const addLink = document.getElementById('add-link');
    addLink.querySelector('input[list="dl-linkgroups"]').addEventListener("focus", _ => {
        const options = project.linkgroups.map(group => {
            let el = document.createElement('option');
            el.textContent = group.name;

            return el;
        });

        addLink.querySelector('datalist').replaceChildren(...options);
    })

    addLink.addEventListener('submit', ev => {
        ev.stopImmediatePropagation();
        ev.preventDefault();

        /** @type {HTMLFormElement} */
        const form = ev.currentTarget;

        const fd = new FormData(form);
        const group = fd.get('group');
        const name = fd.get('name');
        const url = fd.get('url');

        if (!group || !name) return;

        project.linkgroups.find(l => l.name == group).links.push({ name, url })
        initLinks(project);

        form.reset();
    });
}