import { setCurrentProject } from "~/utils/bookmark";

export async function initProject(projectId: string, root: chrome.bookmarks.BookmarkTreeNode) {
    const bookmark = (await chrome.bookmarks.get(projectId))[0];
    if (!bookmark) return;

    await setProjectTitle(bookmark);
    await setProjectList(root);

    document.getElementById('project-drawer')?.addEventListener('click', async (event) => {
        // Set current project
        const button = event.target as HTMLButtonElement;
        setCurrentProject(button.id);
    });
}

export async function setProjectTitle(project: chrome.bookmarks.BookmarkTreeNode) {
    document.getElementById('project')!.textContent = project.title ?? "No project";
}

export async function setProjectList(root: chrome.bookmarks.BookmarkTreeNode) {
    const projects = await chrome.bookmarks.getChildren(root.id);
    const fragment = document.createDocumentFragment();
    for (const project of projects) {
        const template = document.getElementById('project-item-template') as HTMLTemplateElement;
        const projectElement = template.content.cloneNode(true) as HTMLElement;
        projectElement.id = project.id;

        const button = projectElement.querySelector('.project-drawer__item')!;
        button.id = project.id;
        button.textContent = project.title;

        fragment.appendChild(projectElement);
    }

    document.getElementById('project-drawer')?.querySelector('.project-drawer__list')?.replaceChildren(fragment);
}