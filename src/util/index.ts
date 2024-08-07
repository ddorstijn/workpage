import { Bookmarks, bookmarks, storage } from "webextension-polyfill";

export async function getCurrentProject(): Promise<Bookmarks.BookmarkTreeNode | null> {
    const record = await storage.local.get("currentProjectId");
    if (record.currentProjectId === undefined) {
        return null;
    }

    const projects = await bookmarks.getSubTree(record.currentProjectId).catch(() => undefined);

    if (projects === undefined) {
        return null;
    }

    return projects[0];
}

export async function mergeLocalStorage(id: string, data: Object) {
    const record = (await storage.local.get(id)).id;
    const merged = { ...record, ...data };

    await storage.local.set({ [id]: merged });
}