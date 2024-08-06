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

export async function recursiveDeleteBookmarks(node: Bookmarks.BookmarkTreeNode) {
    const tree = (await bookmarks.getSubTree(node.id))[0];

    if (tree.children) {
        for (const child of tree.children!) {
            await recursiveDeleteBookmarks(child);
        }
    }

    await bookmarks.remove(node.id);
}