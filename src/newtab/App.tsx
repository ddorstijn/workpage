import { Component, createResource, For } from "solid-js";
import { getCurrentProject, setCurrentProject } from "../util";
import { bookmarks, storage } from "webextension-polyfill";
import { Tasks } from "./components/Tasks";
import { LinkGroup } from "./components/LinkGroup";
import { Clock } from "./components/Clock";
import { Header } from "./components/Header";
import { Projects } from "./components/Projects";

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
                url: "https://youtube.google.com",
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

export const App: Component = () => {
    const [root] = createResource(async () => {
        const roots = await bookmarks.search({ title: "Workpage" });
        if (roots.length > 1) {
            alert("Error fetching projects: Too many bookmark folders named 'Workpage'. Please delete the one that is not needed.");
            return;
        }

        if (roots.length === 0) {
            const rootBookmark = await bookmarks.create({ title: "Workpage" });
            const defaultBookmark = await bookmarks.create({ title: "Default", parentId: rootBookmark.id });
            for (const group of TEMPLATE) {
                const groupBookmark = await bookmarks.create({ title: group.title, parentId: defaultBookmark.id });
                for (const link of group.links) {
                    await bookmarks.create({ title: link.title, url: link.url, parentId: groupBookmark.id });
                }
            }

            setCurrentProject(defaultBookmark);
            return rootBookmark;
        }

        return roots[0];
    });

    const [projects, { refetch: refetchProjects }] = createResource(root, async () => { console.log("refetching projects"); return await bookmarks.getChildren(root()!.id) });
    const [currentProject, { refetch: refetchCurrent }] = createResource(getCurrentProject);

    async function refetch(parentId: string | undefined) {
        if (parentId === root()?.id) {
            refetchProjects();
            return;
        }

        if (!currentProject()) {
            return;
        }

        refetchCurrent();
    }

    bookmarks.onMoved.addListener(async (_, info) => await refetch(info.parentId));
    bookmarks.onCreated.addListener(async (_, bookmark) => await refetch(bookmark.parentId));
    bookmarks.onRemoved.addListener(async (id, info) => {
        await refetch(info.parentId);
        // This will make current project null if it is removed
        if (currentProject()?.id === id) {
            await refetchCurrent();
        }
    });
    storage.local.onChanged.addListener((changes) => {
        if (changes.currentProjectId) {
            refetchCurrent();
        }
    })

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Header currentProject={currentProject} projects={projects} root={root} />

            <main style={{ display: "flex", flex: 1, 'flex-direction': "column", "align-items": "center", "justify-content": "center" }}>
                <Clock />
                <Projects projects={projects} currentProject={currentProject} />

                <ol style={{ display: "flex", "justify-content": "center" }}>
                    <For each={currentProject()?.children}>
                        {(group) => <LinkGroup group={group} />}
                    </For>
                </ol>
            </main>

            <aside>
                <Tasks currentProject={currentProject} />
            </aside>
        </div>
    );
}