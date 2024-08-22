import './links.css';

export async function initLinks(projectId: string | null, root: chrome.bookmarks.BookmarkTreeNode) {
    if (projectId) {
        await setGroups(projectId);
    }

    chrome.bookmarks.onCreated.addListener(async (_, bookmark) => {
        if (!bookmark.parentId || bookmark.parentId === root.id) return;

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
            return;
        }

        if (info.parentId === projectId) {
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

        const [bookmark] = await chrome.bookmarks.get(id).catch(() => []);
        if (!bookmark || bookmark.parentId == root.id) return;

        if (info.url) {
            setLinkTitleUrl({ id, title: info.title, url: info.url });
        } else {
            setGroupTitle({ id, title: info.title });
        }
    });
}

export async function setGroups(projectId: string) {
    const groups = await chrome.bookmarks.getChildren(projectId).catch(() => []);

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
    const links = await chrome.bookmarks.getChildren(groupId!).catch(() => []);

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