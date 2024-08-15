import { bookmarks, Bookmarks } from "webextension-polyfill";
import { getCurrentProject, setCurrentProject } from "~/utils/bookmark";

export async function initProject(root: Bookmarks.BookmarkTreeNode) {
    document.getElementById('project')!.textContent = (await getCurrentProject())?.id ?? "No project";

    const projects = await bookmarks.getChildren(root.id);
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

document.getElementById('project-drawer')?.addEventListener('click', async (event) => {
    // Set current project
    const button = event.target as HTMLButtonElement;
    setCurrentProject(button.id);
});