import "./tasks.css";

export async function initTasks(projectId: string | null) {
    if (projectId) {
        await createTaskItems(projectId);
    }

    document.getElementById('add-task-form')!.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const title = form.querySelector('input')!.value;
        form.reset();

        await createTask(projectId, title);
    });

    document.getElementById('task-list')!.addEventListener('change', async (event) => {
        const checkbox = event.target as HTMLInputElement;
        const taskId = checkbox.closest('.task-item')!.id;
        const task = (await chrome.storage.sync.get(taskId))[taskId];
        chrome.storage.sync.set({ [taskId]: Object.assign({}, task, { completed: checkbox.checked }) });
    });

    document.getElementById('task-search')!.addEventListener('input', async (event) => {
        const input = event.target as HTMLInputElement;
        const searchTerm = input.value.trim().toLowerCase();
        const listItems = document.getElementById('task-list')!.querySelectorAll('.task-item') as NodeListOf<HTMLLIElement>;
        for (let i = 0; i < listItems.length; i++) {
            const item = listItems[i];

            if (!item.querySelector('.task-title')!.textContent!.trim().toLowerCase().includes(searchTerm)) {
                item.classList.add('hidden');
                continue;
            }

            item.classList.remove('hidden');
        }
    });

    document.getElementById('add-task-btn')!.addEventListener('click', async () => {
        document.getElementById('task-new')?.focus();
    });

    chrome.storage.sync.onChanged.addListener(async (info) => {
        if (info[`t-${projectId}`]) {
            await createTaskItems(projectId);
        }
    });
}

export async function createTask(projectId: string | null, title: string) {
    if (!projectId) return alert('No active project');

    const tasks: string[] = (await chrome.storage.sync.get(`t-${projectId}`))[`t-${projectId}`!] ?? [];

    const id = crypto.randomUUID();
    tasks.unshift(id);

    chrome.storage.sync.set({ [id]: { title, completed: false } })
    chrome.storage.sync.set({ [`t-${projectId}`]: tasks });
}

export async function createTaskItems(projectId: string | null) {
    if (!projectId) return;

    const tasks: string[] = (await chrome.storage.sync.get(`t-${projectId}`))[`t-${projectId}`!];
    if (!tasks) return;

    const fragment = document.createDocumentFragment();
    for (const taskId of tasks) {
        const template = document.getElementById('task-item-template') as HTMLTemplateElement;
        const taskElement = template.content.cloneNode(true) as HTMLElement;

        const task = (await chrome.storage.sync.get(taskId))[taskId];

        taskElement.firstElementChild!.id = taskId;
        taskElement.querySelector('.task-title')!.textContent = task.title;
        taskElement.querySelector('input')!.checked = task.completed;

        fragment.appendChild(taskElement);
    }

    document.getElementById('task-list')!.replaceChildren(fragment);
}