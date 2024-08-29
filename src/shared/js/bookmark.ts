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

export async function createDefaultProject(root: chrome.bookmarks.BookmarkTreeNode) {
    const project = await chrome.bookmarks.create({ title: "Default", parentId: root.id });
    for (const groupTpl of TEMPLATE) {
        const group = await chrome.bookmarks.create({ title: groupTpl.title, parentId: project.id });
        for (const linkTpl of groupTpl.links) {
            await chrome.bookmarks.create({ title: linkTpl.title, url: linkTpl.url, parentId: group.id });
        }
    }

    await setCurrentProject(project.id);
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

export async function getProjectsSorted(rootId: string | undefined): Promise<(chrome.bookmarks.BookmarkTreeNode & { used: number })[]> {
    if (!rootId) {
        return [];
    }

    const projects = await chrome.bookmarks.getChildren(rootId);
    const history: Record<string, number> = (await chrome.storage.sync.get("project_history"))["project_history"] ?? {};
    const projectsWithHistory = projects.map((project) => {
        return { ...project, used: history[project.id] ?? 0 };
    })

    return projectsWithHistory!.sort((a, b) => b.used - a.used);
}

export async function getCurrentProjectId(): Promise<string | null> {
    const id = (await chrome.storage.local.get(PROJECT_KEY))[PROJECT_KEY];
    try {
        const bookmark = await chrome.bookmarks.get(id);
        return bookmark?.[0]?.id;
    } catch {
        return null;
    }
}

export async function getCurrentProject() {
    const currentProjectId = await getCurrentProjectId();
    if (!currentProjectId) return null;

    try {
        const projects = await chrome.bookmarks.get(currentProjectId);
        return projects[0];
    } catch {
        return null
    }
}

export async function setCurrentProject(projectId: string) {
    const history = (await chrome.storage.sync.get("project_history"))["project_history"] ?? {};
    await chrome.storage.sync.set({ "project_history": Object.assign(history, { [projectId]: Date.now() }) });

    await chrome.storage.local.set({ [PROJECT_KEY]: projectId });
}