export async function initLinks(projectId: string) {
    document.getElementById('links')!.querySelector('ol')!.replaceChildren();

    await setGroups(projectId);
}

export async function setGroups(projectId: string) {
    const groups = await chrome.bookmarks.getChildren(projectId);

    const fragment = document.createDocumentFragment();
    for (const group of groups!) {
        const template = document.getElementById("group-template") as HTMLTemplateElement;
        const groupEl = template.content.cloneNode(true) as HTMLElement;
        groupEl.firstElementChild!.id = group.id;
        groupEl.querySelector('.group-title')!.textContent = group.title;

        await setGroupLinks(group.id, groupEl);

        fragment.appendChild(groupEl);
    }

    document.getElementById('links')!.querySelector('ol')?.replaceChildren(fragment);
}

export async function setGroupTitle(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    document.getElementById(bookmark.id)!.querySelector('.group-title')!.textContent = bookmark.title;
}

export async function setGroupLinks(groupId: string, groupEl: HTMLElement | null = document.getElementById(groupId)) {
    const links = await chrome.bookmarks.getChildren(groupId!);

    const fragment = document.createDocumentFragment();
    for (const link of links!) {
        const template = document.getElementById('link-template') as HTMLTemplateElement;
        const linkEl = template.content.cloneNode(true) as HTMLElement;
        linkEl.firstElementChild!.id = link.id;

        const anchor = linkEl.querySelector('a')!;
        anchor.textContent = link.title;
        anchor.href = link.url!;

        fragment.appendChild(linkEl);
    }

    groupEl?.querySelector('.group-links')!.replaceChildren(fragment);
}

export async function setLinkTitleUrl(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    document.getElementById(bookmark.id)!.querySelector('a')!.textContent = bookmark.title;
    document.getElementById(bookmark.id)!.querySelector('a')!.href = bookmark.url!;
}