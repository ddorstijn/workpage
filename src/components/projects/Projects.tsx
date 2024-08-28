import { Component, createMemo, createResource, For, Resource } from "solid-js";
import { getProjectsSorted, setCurrentProject } from "~/shared/js/bookmark";

import { ProjectItem } from "./ProjectItem";

import "./Projects.css";

interface Props {
    root: Resource<chrome.bookmarks.BookmarkTreeNode>;
    currentProject: Resource<chrome.bookmarks.BookmarkTreeNode | null>;
}

export const Projects: Component<Props> = (props) => {
    const [projects, { refetch: refetchProjects }] = createResource(async () => await getProjectsSorted(props.root()?.id));

    createMemo(async () => {
        if (!props.root() || !props.currentProject()) {
            return;
        }

        await refetchProjects();
    });

    async function onFilterInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const searchTerm = input.value.trim().toLowerCase();
        const listItems = document.getElementById('project-list')!.querySelectorAll('.project-item') as NodeListOf<HTMLLIElement>;

        for (let i = 0; i < listItems.length; i++) {
            const item = listItems[i];

            if (!item.querySelector('.project-item__title')!.textContent!.trim().toLowerCase().includes(searchTerm)) {
                item.classList.add('hidden');
                continue;
            }

            item.classList.remove('hidden');
        }
    }

    async function add(event: Event) {
        event.preventDefault();

        const input = event.target as HTMLInputElement;
        const title = input.value;
        input.value = "";

        const project = await chrome.bookmarks.create({ title, parentId: props.root()!.id });
        await setCurrentProject(project.id);
    }

    async function refetchProjectsIfApplicable(parentId: string | undefined) {
        if (parentId && parentId === props.root()!.id) {
            await refetchProjects();
        }
    }

    chrome.bookmarks.onCreated.addListener(async (_, bookmark) => {
        refetchProjectsIfApplicable(bookmark.parentId);
    });

    chrome.bookmarks.onRemoved.addListener(async (_, info) => {
        refetchProjectsIfApplicable(info.parentId);
    });

    chrome.bookmarks.onChanged.addListener(async (id, info) => {
        if (projects()?.find(project => project.id === id)?.title !== info.title) {
            await refetchProjects();
        }
    });

    return (
        <section aria-label="Project" id="project">
            <button id="project-button" popovertarget="project-drawer">
                <span id="project-title">{props.currentProject()?.title ?? "Select a project"}</span>
                <i class="ph ph-caret-down"></i>
            </button>
            <div id="project-drawer" popover>
                <header>
                    <h2>Projects</h2>
                    <div class="toolbar">
                        <label class="expand-search">
                            <input id="project-search" type="search" placeholder="Search project" onInput={onFilterInput} />
                            <i class="ph ph-magnifying-glass"></i>
                        </label>
                        <label id="add-project-btn" class="toggle" aria-controls="add-project-form" onClick={() => document.getElementById('project-new')!.focus()}>
                            <input type="checkbox" />
                            <i class="open ph ph-plus"></i>
                            <i class="close ph ph-minus"></i>
                            new
                        </label>
                    </div>

                    <div id="add-project-form" class="project-item">
                        <div class="project-item__content">
                            <input id="project-new" type="text" placeholder="New project" onKeyDown={(event) => event.key === "Enter" && add(event)} />
                        </div>
                    </div>
                </header>

                <ol id="project-list">
                    <For each={projects()}>
                        {(project) => <ProjectItem project={project} currentProject={props.currentProject} />}
                    </For>
                </ol>
            </div>
        </section>
    );
};