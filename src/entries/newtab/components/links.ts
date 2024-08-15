import { Bookmarks, bookmarks } from "webextension-polyfill";

export async function initLinks(projectId: string) {
    document.getElementById('links')!.querySelector('ol')!.replaceChildren();

    const groups = await bookmarks.getChildren(projectId);
    for (const group of groups!) {
        await createGroupElement(group);
    }
}

export async function createGroupElement(group: Bookmarks.BookmarkTreeNode) {
    const template = document.getElementById("group-template") as HTMLTemplateElement;
    const groupEl = template.content.cloneNode(true) as HTMLElement;
    groupEl.querySelector('.group-title')!.textContent = group.title;

    await createLinks(group.id, groupEl);

    document.getElementById('links')!.querySelector('ol')?.appendChild(groupEl);
}

export async function updateGroupElement(bookmark: Bookmarks.BookmarkTreeNode) {
    document.getElementById(bookmark.id)!.querySelector('.group-title')!.textContent = bookmark.title;
}

export async function createLinks(groupId: string, groupEl: HTMLElement | null = document.getElementById(groupId)) {
    const links = await bookmarks.getChildren(groupId!);

    const fragment = document.createDocumentFragment();
    for (const link of links!) {
        const template = document.getElementById('link-template') as HTMLTemplateElement;
        const linkEl = template.content.cloneNode(true) as HTMLElement;
        linkEl.id = link.id;

        const anchor = linkEl.querySelector('a')!;
        anchor.textContent = link.title;
        anchor.href = link.url!;

        fragment.appendChild(linkEl);
    }

    groupEl?.querySelector('.group-links')!.replaceChildren(fragment);
}