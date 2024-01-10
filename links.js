import { sortable } from './utils/sortable.js';

/**
 * 
 * @param {Project} project 
 */
export function initLinks(project) {
    sortable(document.querySelector('.links'), {
        items: project.linkgroups,
        template: (group) => {
            let groupEl = document.createElement('li');
            groupEl.classList.add('linkgroup');
            groupEl.dataset['color'] = group.color;
            groupEl.innerHTML = `<header><h2>${group.name}</h2></header>`;

            let listEl = groupEl.appendChild(document.createElement('ol'));
            sortable(listEl, {
                items: group.links,
                template: (link) => {
                    let linkEl = document.createElement('li');
                    linkEl.classList.add('link');
                    linkEl.innerHTML = `<a href="${link.url}">${link.name}</a>`;

                    return linkEl;
                },
                group: "links",
                mode: "vertical",
                data: (item) => {
                    return {
                        type: "text/plain",
                        content: item.url,
                    };
                }
            });

            return groupEl;
        },
        group: "linkgroup",
        mode: "horizontal"
    });
}