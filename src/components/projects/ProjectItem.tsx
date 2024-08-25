import { Component, Resource, Show } from "solid-js";

import { setCurrentProject } from "~/shared/js/bookmark";

import "./ProjectItem.css";

interface Props {
    project: chrome.bookmarks.BookmarkTreeNode & { used: number };
    currentProject: Resource<chrome.bookmarks.BookmarkTreeNode | null>;
}

export const ProjectItem: Component<Props> = (props) => {
    let titleEl: HTMLButtonElement | undefined;
    let inputEl: HTMLInputElement | undefined;

    function edit() {
        titleEl?.classList.add('hidden');
        inputEl?.classList.remove('hidden');
        inputEl?.focus();
    }

    async function remove() {
        await chrome.bookmarks.remove(props.project.id);
    }

    async function updateProject() {
        inputEl?.classList.add('hidden');
        titleEl?.classList.remove('hidden');
        await chrome.bookmarks.update(props.project.id, { title: inputEl!.value });
    };

    return (
        <li class="project-item">
            <div class="project-item__content">
                <input
                    ref={inputEl}
                    type="text"
                    class="project-item__input hidden"
                    value={props.project.title}
                    onBlur={updateProject}
                    onKeyDown={(event) => event.key === 'Enter' && inputEl?.blur()}
                />
                <button
                    ref={titleEl}
                    onClick={() => setCurrentProject(props.project.id)}
                    class="project-item__title"
                    popovertarget="project-drawer"
                    popovertargetaction="hide"
                >
                    {props.project.title} <Show when={props.currentProject()?.id === props.project.id}>(current)</Show>
                </button>
                <span class="project-item__used">
                    {new Date(props.project.used).toLocaleDateString('en-GB')}
                </span>
            </div>
            <div class="options">
                <button class="clear edit" onClick={edit}>
                    <i class="ph-fill ph-pen"></i>
                </button>
                <button class="clear delete" onClick={remove}>
                    <i class="ph-fill ph-trash-simple"></i>
                </button>
            </div>
        </li>
    )
}