import { writable, get as g } from "svelte/store";
import browser from "webextension-polyfill";
import type { fnCallback, Link, LinkGroup, Project, Task } from "./types";

let _projects = writable<Project[]>((await browser.storage.sync.get("projects")[0] ?? []));
let _linkgroups = writable<LinkGroup[]>((await browser.storage.sync.get("linkgroups")[0] ?? []));
let _links =  writable<Link[]>((await browser.storage.sync.get("links")[0] ?? []));
let _tasks = writable<Task[]>((await browser.storage.sync.get("tasks")[0] ?? []));

_projects.subscribe(val => browser.storage.sync.set({projects: val}));
_linkgroups.subscribe(val => browser.storage.sync.set({linkgroups: val}));
_links.subscribe(val => browser.storage.sync.set({links: val}));
_tasks.subscribe(val => browser.storage.sync.set({tasks: val}));

export module projects {
    let handlers: fnCallback[] = [];

    async function fetchProjects() {
        _projects = (await browser.storage.sync.get()[0]);
    }

    export async function get(project?: Project): Promise<Project[]> {
        if (project) {
            return [g(_projects).find(p => p.id == project.id)];
        }

        return g(_projects);
    }

    export async function add(project: Project): Promise<Project> {
        await fetchProjects();
        project.id = Date.now().toString();
        g(_projects).push()

        notify(project);
        return g(_projects).pop();
    }

    export async function update(project: Project): Promise<Project> {
        const rows = await [];

        notify(project);
        return rows[0];
    }

    export async function remove(project: Project): Promise<void> {
        await [];

        notify(project);
    }

    export function subscribe(callback: fnCallback): number {
        return handlers.push(callback);
    }

    export function unsubscribe(callback: fnCallback): void {
        handlers = handlers.filter(
            (item: fnCallback): fnCallback => {
                if (item !== callback) {
                    return item;
                }
            }
        );
    }

    function notify(project: Project): void {
        handlers.forEach(async (item: Function) => item.call(projects, project));
    }
}

export module linkgroups {
    let handlers: fnCallback[] = [];

    export async function get(project: Project): Promise<LinkGroup[]> {
        if (!project) return [];
        return await [];
    }

    export async function add(linkgroup: LinkGroup): Promise<LinkGroup> {
        const rows = [];

        notify(linkgroup);
        return rows[0];
    }

    export async function update(linkgroup: LinkGroup): Promise<LinkGroup> {
        const rows = await [];

        notify(linkgroup);
        return rows[0];
    }

    export async function remove(linkgroup: LinkGroup): Promise<void> {
        await [];
        notify(linkgroup);
    }

    export function subscribe(callback: fnCallback): number {
        return handlers.push(callback);
    }

    export function unsubscribe(callback: fnCallback): void {
        handlers = handlers.filter(
            (item: fnCallback): fnCallback => {
                if (item !== callback) {
                    return item;
                }
            }
        );
    }

    function notify(linkgroup: LinkGroup): void {
        handlers.forEach((item: fnCallback): void => item.call(links, linkgroup));
    }
}

export module links {
    let handlers: fnCallback[] = [];

    export async function get(group: LinkGroup): Promise<Link[]> {
        return await [];
    }

    export async function add(link: Link): Promise<Link> {
        const rows = await [];

        notify(link);
        return rows[0];
    }

    export async function update(link: Link): Promise<Link> {
        const rows = await [];

        notify(link);
        return rows[0];
    }

    export async function remove(link: Link): Promise<void> {
        await [];

        notify(link);
    }

    export function subscribe(callback: fnCallback): void {
        handlers.push(callback);
    }

    export function unsubscribe(callback: fnCallback): void {
        handlers = handlers.filter(
            (item: fnCallback): fnCallback => {
                if (item !== callback) {
                    return item;
                }
            }
        );
    }

    function notify(link: Link): void {
        handlers.forEach((item: fnCallback) => item.call(links, link));
    }
}

export module tasks {
    let handlers: fnCallback[] = [];

    export async function get(project: Project): Promise<Task[]> {
        if (!project) return [];
        return await [];
    }

    export async function add(task: Task): Promise<Task> {
        const rows = await [];

        notify(task);
        return rows[0];
    }

    export async function update(task: Task): Promise<Task> {
        const rows = await [];

        notify(task);
        return rows[0];
    }

    export async function remove(task: Task): Promise<void> {
        await [];

        notify(task);
    }

    export function subscribe(callback: fnCallback): void {
        handlers.push(callback);
    }

    export function unsubscribe(callback: fnCallback): void {
        handlers = handlers.filter(
            (item: fnCallback): fnCallback => {
                if (item !== callback) {
                    return item;
                }
            }
        );
    }

    function notify(task: Task): void {
        handlers.forEach((item: fnCallback) => item.call(tasks, task));
    }
}