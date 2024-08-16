import { getCurrentProjectId, PROJECT_KEY, setCurrentProject } from "~/utils/bookmark";

export async function initProject(projectId: string, root: chrome.bookmarks.BookmarkTreeNode) {
    const [bookmark] = await chrome.bookmarks.get(projectId).catch(() => []);
    if (!bookmark) return;

    await setProjectTitle(bookmark);
    await setProjectList(root);

    document.getElementById('project-list')?.addEventListener('click', async (event) => {
        const target = event.target as HTMLElement;
        const item = target.closest('.project-item');
        if (item) {
            setCurrentProject(item.id);
        }
    });

    chrome.storage.local.onChanged.addListener(async (info) => {
        if (info[PROJECT_KEY]) {
            const history = (await chrome.storage.sync.get("project_history"))["project_history"] ?? {};
            await chrome.storage.sync.set({ "project_history": Object.assign(history, { [info[PROJECT_KEY].newValue]: Date.now() }) });

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
            document.getElementById(id)!.querySelector('.project-item')!.textContent = bookmark.title;
        }
    });
}

export async function setProjectTitle(project: chrome.bookmarks.BookmarkTreeNode) {
    document.getElementById('project-title')!.textContent = project.title ?? "No project";
}

export async function setProjectList(root: chrome.bookmarks.BookmarkTreeNode) {
    const projects = await chrome.bookmarks.getChildren(root.id).catch(() => []);
    if (!projects.length) return;

    const history = (await chrome.storage.sync.get("project_history"))["project_history"] ?? {};

    projects.sort((a, b) => {
        if (history[a.id] && history[b.id]) {
            return history[b.id] - history[a.id];
        } else if (history[a.id]) {
            return -1;
        } else if (history[b.id]) {
            return 1;
        } else {
            return 0;
        }
    });

    const fragment = document.createDocumentFragment();
    for (const project of projects) {
        const template = document.getElementById('project-item-template') as HTMLTemplateElement;
        const projectElement = template.content.cloneNode(true) as HTMLElement;
        projectElement.id = project.id;

        const button = projectElement.querySelector('.project-item')!;
        button.id = project.id;

        const currentProjectId = await getCurrentProjectId();
        let title = project.id === currentProjectId ? project.title + " (Current)" : project.title;
        button.querySelector('.project-item__title')!.textContent = title;

        const dateSettings = { year: 'numeric', month: 'short', day: 'numeric' } as Intl.DateTimeFormatOptions;
        const used = history[project.id] ? new Date(history[project.id]).toLocaleString('en-GB', dateSettings) : "unkown";
        button.querySelector('.project-item__used')!.textContent = used;

        fragment.appendChild(projectElement);
    }

    document.getElementById('project-list')?.replaceChildren(fragment);
}