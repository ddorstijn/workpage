import { getCurrentProjectId } from "~/utils/bookmark";
import "./tasks.css";

function getTasksIdentifier(projectId: string) {
    return `t-${projectId}`;
}

async function getTasksForProject(projectId: string | null): Promise<string[]> {
    if (!projectId) return [];

    const id = getTasksIdentifier(projectId);
    return (await chrome.storage.sync.get(id))[id] ?? [];
}

async function submitAddTask(event: SubmitEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const title = form.querySelector('input')!.value;
    form.reset();

    const projectId = await getCurrentProjectId();
    if (!projectId) return alert('No active project');

    const tasks = await getTasksForProject(projectId);

    const id = crypto.randomUUID();
    tasks.unshift(id);

    await Promise.all([
        chrome.storage.sync.set({ [id]: { title, completed: false } }),
        chrome.storage.sync.set({ [getTasksIdentifier(projectId)]: tasks })
    ]);
}

function inputFilterTasks(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.trim().toLowerCase();
    const listItems = document.getElementById('task-list')!.querySelectorAll<HTMLLIElement>('.task-item');

    for (let i = 0; i < listItems.length; i++) {
        const item = listItems[i];

        if (!item.querySelector('.task-title')!.textContent!.trim().toLowerCase().includes(searchTerm)) {
            item.classList.add('hidden');
            continue;
        }

        item.classList.remove('hidden');
    }
}

export async function initTasks(projectId: string | null) {
    if (projectId) {
        await createTaskItems(projectId);
    }

    document.getElementById('add-task-form')!.addEventListener('submit', submitAddTask);
    document.getElementById('task-search')!.addEventListener('input', inputFilterTasks);
    document.getElementById('add-task-btn')!.addEventListener('click', async () => {
        document.getElementById('task-new')?.focus();
    });

    chrome.storage.sync.onChanged.addListener(async (info) => {
        if (info[getTasksIdentifier(projectId!)]) {
            await createTaskItems(projectId);
        }

        for (const key in info) {
            const el = document.getElementById(key);
            if (el) {
                el.querySelector('.task-title')!.textContent = info[key]!.newValue.title;
                el.querySelector('.task-textarea')!.setAttribute('value', info[key]!.newValue.title);
                el.querySelector('.checkbox input')!.setAttribute('checked', info[key]!.newValue.completed);
            }
        }
    });
}

export async function createTaskItems(projectId: string | null) {
    if (!projectId) return;

    const taskIds = await getTasksForProject(projectId);
    if (!taskIds) return;

    const fragment = document.createDocumentFragment();
    for (const taskId of taskIds) {
        const taskElement = await createTaskItem(taskId, projectId);
        fragment.appendChild(taskElement);
    }

    document.getElementById('task-list')!.replaceChildren(fragment);
}

async function createTaskItem(taskId: string, projectId: string) {
    const template = document.getElementById('task-item-template') as HTMLTemplateElement;
    const taskElement = template.content.cloneNode(true) as HTMLElement;

    const task = (await chrome.storage.sync.get(taskId))[taskId] as { title: string; completed: boolean };

    taskElement.firstElementChild!.id = taskId;

    const checkbox = taskElement.querySelector('.checkbox input')! as HTMLInputElement;
    const title = taskElement.querySelector('.task-title')! as HTMLSpanElement;
    const input = taskElement.querySelector('.task-textarea')! as HTMLTextAreaElement;

    input.value = task.title;
    title.textContent = task.title;
    checkbox.checked = task.completed;

    checkbox.addEventListener('change', async () => {
        chrome.storage.sync.set({ [taskId]: { ...task, completed: checkbox.checked } });
    });

    taskElement
        .querySelector('.delete')!
        .addEventListener('click', async () => {
            await chrome.storage.sync.remove(taskId);
            const taskIds = await getTasksForProject(projectId);
            taskIds.splice(taskIds.indexOf(taskId), 1);
            chrome.storage.sync.set({ [getTasksIdentifier(projectId)]: taskIds });
        });

    taskElement
        .querySelector('.edit')!
        .addEventListener('click', async () => {
            input.classList.remove('hidden');
            title.classList.add('hidden');
            input.focus();
        });

    input.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            input.blur();
        }

        if (event.key === 'Escape') {
            input.value = title.textContent!;

            input.classList.add('hidden');
            title.classList.remove('hidden');
        }
    });

    input.addEventListener('blur', async () => {
        await chrome.storage.sync.set({ [taskId]: { ...task, title: input.value } });

        input.classList.add('hidden');
        title.classList.remove('hidden');
    });

    return taskElement;
}