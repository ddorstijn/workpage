export const PROJECT_KEY = "currentProjectId";

const TEMPLATE = [
    {
        title: "Google",
        links: [
            {
                title: "Maps",
                url: "https://maps.google.com",
            },
            {
                title: "Youtube",
                url: "https://youtube.com",
            },
            {
                title: "Gmail",
                url: "https://mail.google.com",
            },
            {
                title: "Drive",
                url: "https://drive.google.com",
            },
            {
                title: "Search",
                url: "https://search.google.com",
            },
        ],
    },
    {
        title: "Entertainment",
        links: [
            {
                title: "Netflix",
                url: "https://netflix.com",
            },
            {
                title: "Reddit",
                url: "https://reddit.com",
            },
            {
                title: "HBO",
                url: "https://hbo.com",
            },
            {
                title: "HackerNews",
                url: "https://ycombinator.com",
            },
        ],
    },
    {
        title: "Development",
        links: [
            {
                title: "Stack Overflow",
                url: "https://stackoverflow.com",
            },
            {
                title: "Stack Exchange",
                url: "https://stackexhange.com",
            },
            {
                title: "ChatGPT",
                url: "https://chat.openai.com",
            },
        ],
    },
    {
        title: "Communication",
        links: [
            {
                title: "WhatsApp",
                url: "https://web.whatsapp.com",
            },
            {
                title: "Discord",
                url: "https://discord.gg",
            },
            {
                title: "Signal",
                url: "https://signal.com",
            },
        ],
    },
];

export async function createDefaultProject() {
    const rootBookmark = await getRoot();
    const defaultBookmark = await chrome.bookmarks.create({ title: "Default", parentId: rootBookmark.id });
    for (const group of TEMPLATE) {
        const groupBookmark = await chrome.bookmarks.create({ title: group.title, parentId: defaultBookmark.id });
        for (const link of group.links) {
            await chrome.bookmarks.create({ title: link.title, url: link.url, parentId: groupBookmark.id });
        }
    }

    await setCurrentProject(defaultBookmark.id);
}

/**
 * Retrieves the root Workpage bookmark folder. If it doesn't exist, it creates one.
 * @returns A Promise that resolves to the root Workpage bookmark folder.
 * @throws {Error} If there are multiple bookmark folders named 'Workpage'.
 */
export async function getRoot(): Promise<chrome.bookmarks.BookmarkTreeNode> {
    const roots = await chrome.bookmarks.search({ title: "Workpage" });
    if (roots.length > 1) {
        throw new Error("Error fetching projects: Too many bookmark folders named 'Workpage'. Please delete the one that is not needed.");
    }

    if (roots.length === 0) {
        return await chrome.bookmarks.create({ title: "Workpage" });
    }

    return roots[0];
}

export async function getCurrentProjectId() {
    return (await chrome.storage.local.get(PROJECT_KEY))[PROJECT_KEY];
}

export async function getCurrentProject() {
    const currentProjectId = await getCurrentProjectId();
    if (!currentProjectId) return null;

    const projects = await chrome.bookmarks.getSubTree(currentProjectId).catch(() => undefined);
    if (projects === undefined) return null;

    return projects[0];
}

export async function setCurrentProject(projectId: string) {
    await chrome.storage.local.set({ [PROJECT_KEY]: projectId });
}