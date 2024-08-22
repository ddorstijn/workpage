import { createDefaultProject, getCurrentProjectId, getRoot, PROJECT_KEY } from "~/utils/bookmark";
import { initClock } from "./components/clock";
import { initLinks, setGroups } from "./components/links";
import { initProject } from "./components/project";
import { initTasks } from "./components/tasks";

import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/fill";

async function main() {
    initClock();

    document.getElementById('header')!.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    })

    const root = await getRoot();
    document.body.id = root.id;

    const projects = await chrome.bookmarks.getChildren(root.id).catch(() => {
        throw new Error(`Error fetching projects, root(id=${root.id}) not found.`);
    });

    if (projects.length === 0) {
        await createDefaultProject(root);
    }

    const projectId = await getCurrentProjectId();
    await initProject(root);
    await initLinks(projectId, root);
    await initTasks(projectId);

    chrome.storage.local.onChanged.addListener(async (info) => {
        if (info[PROJECT_KEY]) {
            const [bookmark] = await chrome.bookmarks.get(info[PROJECT_KEY].newValue).catch(() => []);
            if (!bookmark) return;

            await setGroups(info[PROJECT_KEY].newValue);
        }
    });
}

main();