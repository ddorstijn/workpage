export async function initTasks(projectId: string) {
    document.getElementById('add-task-form')!.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const title = form.querySelector('input')!.value;
        form.reset();

        await createTask(projectId, title);
    })

    await createTaskItems(projectId);
}

export async function createTask(projectId: string, title: string) {
    const tasks: string[] = (await chrome.storage.sync.get(`t-${projectId}`))[`t-${projectId}`!] ?? [];

    const id = crypto.randomUUID();
    tasks.unshift(id);

    chrome.storage.sync.set({ [id]: { title, completed: false } })
    chrome.storage.sync.set({ [`t-${projectId}`]: tasks });
}

export async function createTaskItems(projectId: string) {
    const tasks: string[] = (await chrome.storage.sync.get(`t-${projectId}`))[`t-${projectId}`!];
    if (!tasks) return;

    const fragment = document.createDocumentFragment();
    for (const taskId of tasks) {
        const template = document.getElementById('task-item-template') as HTMLTemplateElement;
        const taskElement = template.content.cloneNode(true) as HTMLElement;

        const task = (await chrome.storage.sync.get(taskId))[taskId];

        taskElement.firstElementChild!.id = taskId;
        taskElement.querySelector('.task-title')!.textContent = task.title;

        fragment.appendChild(taskElement);
    }

    document.getElementById('task-list')!.replaceChildren(fragment);
}