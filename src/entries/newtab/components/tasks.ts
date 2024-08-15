import { storage } from "webextension-polyfill";

export async function initTasks(projectId: string) {
    const tasks = (await storage.sync.get(`t-${projectId}`))[`t-${projectId}`!];
    if (!tasks) return;

    const fragment = document.createDocumentFragment();
    for (const task of tasks) {
        const template = document.getElementById('task-item-template') as HTMLTemplateElement;
        const taskElement = template.content.cloneNode(true) as HTMLElement;
        taskElement.id = task.id;
        taskElement.querySelector('span')!.textContent = task.title;

        fragment.appendChild(taskElement);
    }

    document.querySelector('.task-list')!.replaceChildren(fragment);
}