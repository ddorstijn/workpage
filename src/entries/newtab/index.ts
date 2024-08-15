import { bookmarks, storage } from "webextension-polyfill";
import { createDefaultProject, getCurrentProject, getCurrentProjectId, getRoot, PROJECT_KEY } from "~/utils/bookmark";
import { initClock } from "./components/clock";
import { createGroupElement, createLinks, initLinks } from "./components/links";
import { initProject } from "./components/project";
import { initTasks } from "./components/tasks";

async function main() {
    initClock();

    const root = await getRoot();
    document.body.dataset.key = root.id;

    const projects = await bookmarks.getChildren(root.id)
    if (projects.length === 0) {
        createDefaultProject();
    }

    const projectId = await getCurrentProjectId();
    await initProject(root);
    await initLinks(projectId);
    await initTasks(projectId);

    const bookmark = (await bookmarks.get(projectId))[0];
    if (bookmark) {
        document.getElementById('project')!.textContent = bookmark.title;
    }

    storage.local.onChanged.addListener(async (info) => {
        if (info[PROJECT_KEY]) {
            const current = await getCurrentProject();
            document.getElementById('project')!.textContent = current!.title;

            await initLinks(info[PROJECT_KEY].newValue);
        }
    });

    bookmarks.onCreated.addListener(async (_, bookmark) => {
        if (!bookmark.parentId) return;

        if (bookmark.parentId === root.id) {
            await initLinks(bookmark.id);
        }

        const projectId = await getCurrentProjectId();
        if (bookmark.parentId === projectId) {
            await createGroupElement(bookmark);
        }

        // Create link if in same project
        const parentGroup = document.getElementById(bookmark.parentId);
        if (parentGroup) {
            await createLinks(bookmark.parentId);
        }
    });

    bookmarks.onRemoved.addListener(async (_, info) => {
        if (!info.parentId) return;

        if (info.parentId === root.id) {
            await initLinks(info.parentId);
        }

        if (info.parentId === await getCurrentProjectId()) {
            const parentGroup = document.getElementById(info.parentId);
            if (parentGroup) {
                parentGroup.remove();
            }
        }

        const parentGroup = document.getElementById(info.parentId);
        if (parentGroup) {
            await createLinks(info.parentId);
        }
    });
}

main();