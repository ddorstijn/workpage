import { getCurrentProject, getCurrentProjectId, PROJECT_KEY, setCurrentProject } from "~/utils/bookmark";

import './project.css';

export async function initProject(root: chrome.bookmarks.BookmarkTreeNode) {
    await setProjectTitle();
    await setProjectList(root);

    document.getElementById('project-search')?.addEventListener('input', async (event) => {
        const input = event.target as HTMLInputElement;
        const searchTerm = input.value.trim().toLowerCase();
        const listItems = document.getElementById('project-list')!.querySelectorAll('.project-item') as NodeListOf<HTMLLIElement>;

        for (let i = 0; i < listItems.length; i++) {
            const item = listItems[i];

            if (!item.querySelector('.project-item__title')!.textContent!.trim().toLowerCase().includes(searchTerm)) {
                item.classList.add('hidden');
                continue;
            }

            item.classList.remove('hidden');
        }
    })

    document.getElementById('add-project-btn')!.addEventListener('click', async () => {
        document.getElementById('project-new')!.focus();
    });

    document.getElementById('add-project-form')!.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const title = form.querySelector('input')!.value;
        form.reset();

        const project = await chrome.bookmarks.create({ title, parentId: root.id });
        setCurrentProject(project.id);
    })

    chrome.storage.local.onChanged.addListener(async (info) => {
        if (info[PROJECT_KEY]) {
            const history = (await chrome.storage.sync.get("project_history"))["project_history"] ?? {};
            await chrome.storage.sync.set({ "project_history": Object.assign(history, { [info[PROJECT_KEY].newValue]: Date.now() }) });

            await setProjectTitle();
            await setProjectList(root);
        }
    });

    chrome.bookmarks.onCreated.addListener(async (_, bookmark) => {
        if (!bookmark.parentId) return;

        if (bookmark.parentId === root.id) {
            await setProjectList(root);
        }
    });

    chrome.bookmarks.onRemoved.addListener(async (_, info) => {
        if (!info.parentId) return;

        if (info.parentId === root.id) {
            await setProjectList(root);
        }
    });

    chrome.bookmarks.onChanged.addListener(async (id, info) => {
        const el = document.getElementById(id);
        if (!el) return;

        const [bookmark] = await chrome.bookmarks.get(id).catch(() => []);
        if (!bookmark) return;

        if (bookmark.parentId === root.id && info.title) {
            const projectItemEl = document.getElementById(id) as HTMLElement;

            projectItemEl.querySelector('.project-item__title')!.textContent = bookmark.title;
            projectItemEl.querySelector('.project-item__input')!.setAttribute('value', bookmark.title);

            if (id == await getCurrentProjectId()) {
                await setProjectTitle();
            }
        }
    });
}

async function setProjectTitle() {
    const project = await getCurrentProject();
    document.getElementById('project-title')!.textContent = project?.title ?? "No project";
}

export async function setProjectList(root: chrome.bookmarks.BookmarkTreeNode) {
    const projects = await chrome.bookmarks.getChildren(root.id).catch(() => []);
    if (!projects.length) return;

    const history: Record<string, number> = (await chrome.storage.sync.get("project_history"))["project_history"] ?? {};
    projects.sort((a, b) => (history[b.id] ?? 0) - (history[a.id] ?? 0));

    const fragment = document.createDocumentFragment();
    for (const project of projects) {
        const projectElement = await createProjectItem(project, history);
        fragment.appendChild(projectElement);
    }

    document.getElementById('project-list')?.replaceChildren(fragment);
}

const template = document.getElementById('project-item-template') as HTMLTemplateElement;
async function createProjectItem(project: chrome.bookmarks.BookmarkTreeNode, history: Record<string, number>): Promise<HTMLElement> {
    const projectElement = template.content.cloneNode(true) as HTMLElement;
    const projectItem = projectElement.querySelector('.project-item')!;
    projectItem.id = project.id;

    const titleEl = projectItem.querySelector('.project-item__title')! as HTMLSpanElement;
    const usedEl = projectItem.querySelector('.project-item__used')! as HTMLSpanElement;
    const inputEl = projectItem.querySelector('.project-item__input')! as HTMLInputElement;
    const editBtn = projectItem.querySelector('.edit')! as HTMLButtonElement;

    titleEl.textContent = project.title;
    inputEl.value = project.title;
    usedEl.textContent = history[project.id] ? new Date(history[project.id]).toLocaleDateString('en-GB') : "unknown";

    if (project.id === await getCurrentProjectId()) {
        projectItem.classList.add('active');
    }

    titleEl.addEventListener('click', async () => {
        await setCurrentProject(project.id);
    });

    projectItem.querySelector('.delete')!.addEventListener('click', async () => {
        await chrome.bookmarks.remove(project.id);
    });

    editBtn.addEventListener('click', async () => {
        inputEl.classList.remove('hidden');
        titleEl.classList.add('hidden');
        inputEl.focus();
    });

    inputEl.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            inputEl.blur();
        }
    });

    inputEl.addEventListener('blur', async () => {
        inputEl.classList.add('hidden');
        titleEl.classList.remove('hidden');
        await chrome.bookmarks.update(project.id, { title: inputEl.value });
    });

    return projectElement;
}
