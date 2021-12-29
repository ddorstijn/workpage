import browser from "webextension-polyfill";
import type { fnCallback, Link, LinkGroup, Project, Task } from "./types";

var _projects: Project[] = new Proxy((await browser.storage.sync.get("projects"))[0] ?? [], {
    get: (target, property) => {
        return target[property];
    },
    set: (target, property, value) => {
        target[property] = value;
        browser.storage.sync.set({projects: value});

        return true;
    }
});

var _linkgroups: LinkGroup[] = new Proxy((await browser.storage.sync.get("linkgroups"))[0] ?? [], {
    get: (target, p, receiver) => {
        return target[p];
    },
    set: (target, property, value) => {
        target[property] = value;
        browser.storage.sync.set({linkgroups: value});

        return true;
    }
});

var _links: Link[] = new Proxy((await browser.storage.sync.get("links"))[0] ?? [], {
    get: (target, p, receiver) => {
        return target[p];
    },
    set: (target, property, value) => {
        target[property] = value;
        browser.storage.sync.set({links: _projects});

        return true;
    }
});

var _tasks: Task[] = new Proxy((await browser.storage.sync.get("tasks"))[0] ?? [], {
    get: (target, p, receiver) => {
        return target[p];
    },
    set: (target, property, value) => {
        target[property] = value;
        browser.storage.sync.set({tasks: value});

        return true;
    }
});

export module projects {
    let handlers: fnCallback[] = [];

    export async function get(project?: Project): Promise<Project[]> {
        if (project) {
            return [_projects.find(p => p.id == project.id)];
        }

        return _projects;
    }

    export async function add(project: Project): Promise<void> {
        project.id = _projects.length;
        _projects.push(project);
    }

    export async function update(project: Project): Promise<void> {
        _projects[project.id] = project;
    }

    export async function remove(project: Project): Promise<void> {
        _projects.splice(Number(project.id), 1);
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