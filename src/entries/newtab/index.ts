import { createDefaultProject, getCurrentProject, getCurrentProjectId, getRoot, PROJECT_KEY } from "~/utils/bookmark";
import { initClock } from "./components/clock";
import { setGroups, setGroupLinks, setLinkTitleUrl, setGroupTitle } from "./components/links";
import { initProject, setProjectTitle, setProjectList } from "./components/project";
import { createTaskItems, initTasks } from "./components/tasks";

import "@phosphor-icons/web/regular";

async function main() {
    initClock();

    document.getElementById('header')!.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    })

    const root = await getRoot();
    document.body.dataset.key = root.id;

    const projects = await chrome.bookmarks.getChildren(root.id)
    if (projects.length === 0) {
        await createDefaultProject();
    }

    const projectId = await getCurrentProjectId();
    await initProject(projectId, root);
    await setGroups(projectId);
    await initTasks(projectId);

    chrome.storage.local.onChanged.addListener(async (info) => {
        if (info[PROJECT_KEY]) {
            const current = await getCurrentProject();
            setProjectTitle(current!);

            await setGroups(info[PROJECT_KEY].newValue);
        }
    });

    chrome.bookmarks.onCreated.addListener(async (_, bookmark) => {
        if (!bookmark.parentId) return;

        if (bookmark.parentId === root.id) {
            await setProjectList(root);
        }

        const projectId = await getCurrentProjectId();
        if (bookmark.parentId === projectId) {
            await setGroups(projectId);
        }

        // Create link if in same project
        const parentGroup = document.getElementById(bookmark.parentId);
        if (parentGroup) {
            await setGroupLinks(bookmark.parentId);
        }
    });

    chrome.bookmarks.onRemoved.addListener(async (_, info) => {
        if (!info.parentId) return;

        if (info.parentId === root.id) {
            await setGroups(info.parentId);
        }

        if (info.parentId === await getCurrentProjectId()) {
            const parentGroup = document.getElementById(info.parentId);
            if (parentGroup) {
                parentGroup.remove();
            }
        }

        const parentGroup = document.getElementById(info.parentId);
        if (parentGroup) {
            await setGroupLinks(info.parentId);
        }
    });

    chrome.bookmarks.onChanged.addListener(async (id, info) => {
        const el = document.getElementById(id);
        if (!el) return;

        if (info.url) {
            setLinkTitleUrl({ id, title: info.title, url: info.url });
        } else {
            setGroupTitle({ id, title: info.title });
        }
    });

    chrome.storage.sync.onChanged.addListener(async (info) => {
        if (info[`t-${projectId}`]) {
            await createTaskItems(projectId);
        }
    });
}

main();