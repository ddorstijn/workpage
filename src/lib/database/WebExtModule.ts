import { storage } from "webextension-polyfill";
import type { fnCallback, Link, LinkGroup, Project, Task } from "./types";

async function getItems(table: string): Promise<any> {
    const record = await storage.sync.get(table);
    if (!record[table]) {
        await storage.sync.set({ [table]: [] });
        return [];
    }

    return record[table];
}

export module projects {
    let handlers: fnCallback[] = [];

    export async function get(project?: Project): Promise<Project[]> {
        const projects: Project[] = await getItems("projects");

        if (project) return [projects.find(p => p.id = project.id)] ?? [];
        return projects;
    }

    export async function add(project: Project): Promise<void> {
        project = { id: Date.now(), name: project.name, used: new Date() };
        let projects = [...await getItems("projects"), project];
        storage.sync.set({ projects });

        notify(project);
    }

    export async function update(project: Project): Promise<void> {
        if (!project?.id) return;

        const projects: Project[] = await getItems("projects");
        const idx = projects.findIndex(p => p.id == project.id);
        projects[idx] = project;
        await storage.sync.set({ projects })

        notify(project);
    }

    export async function remove(project: Project): Promise<void> {
        if (!project?.id) return;

        const projects: Project[] = await getItems("projects");
        const idx = projects.findIndex(p => p.id == project.id);
        projects.splice(idx, 1);
        await storage.sync.set({ projects });

        notify(project);
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
        return (await getItems("linkgroups")).filter((group: LinkGroup) => group.projectId = project.id);
    }

    export async function add(linkgroup: LinkGroup): Promise<void> {
        linkgroup.id = Date.now();
        const linkgroups = [...await getItems("linkgroups"), linkgroup];
        storage.sync.set({ linkgroups });

        notify(linkgroup);
    }

    export async function update(linkgroup: LinkGroup): Promise<void> {
        if (!linkgroup?.id) return;

        const linkgroups: LinkGroup[] = await getItems("linkgroups");
        const idx = linkgroups.findIndex(group => group.id == linkgroup.id);
        linkgroups[idx] = linkgroup;
        await storage.sync.set({ linkgroups });

        notify(linkgroup);
    }

    export async function remove(linkgroup: LinkGroup): Promise<void> {
        if (!linkgroup?.id) return;

        const linkgroups: LinkGroup[] = await getItems("linkgroups");
        const idx = linkgroups.findIndex(group => group.id == linkgroup.id);
        linkgroups.splice(idx, 1);
        await storage.sync.set({ linkgroups });

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

    storage.onChanged.addListener((changes) => {
        let changedItems = Object.keys(changes);

        for (const item of changedItems) {
            if (item == "links") {
                changes[item].newValue
                    .filter(x => !changes[item].oldValue.includes(x))
                    .forEach(l => notify(l));
            }
        }
    })

    export async function get(group: LinkGroup): Promise<Link[]> {
        return (await getItems("links")).filter((l: Link) => l.groupId = group.id);
    }

    export async function add(link: Link): Promise<void> {
        link.id = Date.now();
        const links = [...await getItems("links"), link];
        storage.sync.set({ links });

        notify(link);
    }

    export async function update(link: Link): Promise<void> {
        if (!link?.id) return;

        const links: Link[] = await getItems("links");
        const idx = links.findIndex(l => l.id == link.id);
        links[idx] = link;
        await storage.sync.set({ links });

        notify(link);
    }

    export async function remove(link: Link): Promise<void> {
        if (!link?.id) return;

        const links: Link[] = await getItems("links");
        const idx = links.findIndex(l => l.id == link.id);
        links.splice(idx, 1);
        await storage.sync.set({ links });

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
        return (await getItems("tasks")).filter(t => t.projectId = project.id);
    }

    export async function add(task: Task): Promise<void> {
        task.id = Date.now();
        const tasks = [...await getItems("tasks"), task];
        storage.sync.set({ tasks });

        notify(task);
    }

    export async function update(task: Task): Promise<void> {
        if (!task?.id) return;

        const tasks: Task[] = await getItems("tasks");
        const idx = tasks.findIndex(t => t.id == task.id);
        tasks[idx] = task;
        await storage.sync.set({ tasks });

        notify(task);
    }

    export async function remove(task: Task): Promise<void> {
        if (!task?.id) return;

        const tasks: Task[] = await getItems("tasks");
        const idx = tasks.findIndex(t => t.id == task.id);
        tasks.splice(idx, 1);
        await storage.sync.set({ tasks });

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