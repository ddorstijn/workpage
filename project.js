import { initWorkpage } from "./workpage.js";

export function initProject() {    
    /** @type {HTMLDialogElement} */
    const list = document.querySelector('.project > dialog > ol');
    const button = document.querySelector('.project > button');
    button.querySelector('span').textContent = localStorage.getItem('active') ?? 'General';
    button.addEventListener('click', async () => {
        let data = await chrome.storage.sync.get();
        /** @type {{name: string, used: Date}[]} */
        let projects = Object.keys(data).map(name => { return { name, used: new Date(data[name].used) } }).sort((a, b) => a.used.getTime() - b.used.getTime());
    
        list.replaceChildren();
        for (const project of projects) {
            const projectEl = list.appendChild(document.createElement('li'));
            projectEl.classList.add('project__item');
            projectEl.innerHTML = `<span>${project.name}</span><span class="project__item-used">${project.used.toLocaleDateString()}</span>`;
            projectEl.addEventListener('click', () => {
                initWorkpage(project.name);
                document.querySelector('.project > dialog').close(); 
            });
        }
    });
}