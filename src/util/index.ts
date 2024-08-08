import { Bookmarks, bookmarks, storage } from "webextension-polyfill";

const PROJECT_KEY = "currentProjectId";

export async function getCurrentProject(): Promise<Bookmarks.BookmarkTreeNode | null> {
    debugger;
    const currentProject = (await storage.local.get(PROJECT_KEY))[PROJECT_KEY];
    if (currentProject === undefined) {
        return null;
    }

    const projects = await bookmarks.getSubTree(currentProject).catch(() => undefined);
    if (projects === undefined) {
        return null;
    }

    return projects[0];
}

export async function setCurrentProject(project: Bookmarks.BookmarkTreeNode | null) {
    await storage.local.set({ [PROJECT_KEY]: project?.id });
}

export async function mergeLocalStorage(id: string, data: Object) {
    const record = (await storage.local.get(id)).id;
    const merged = { ...record, ...data };

    await storage.local.set({ [id]: merged });
}