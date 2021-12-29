import { storage } from "webextension-polyfill";
import type { fnCallback, Link, LinkGroup, Project, Task } from "./types";
import { v4 as uuidv4 } from 'uuid';

async function getItems(table: string): Promise<any[]> {
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

        if (project) {
            let p = projects.find(p => p.id = project.id);
            return p ? [p] : [];
        }
        
        return projects;
    }

    export async function add(project: Project): Promise<Project> {
        project.id = uuidv4();
        project.used = new Date();
        let projects = [...await getItems("projects"), project];
        storage.sync.set({ projects });

        notify(project);
        return project;
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

        (await getItems("linkgroups"))
            .filter((g: LinkGroup) => g.projectId == project.id)
            .forEach((g: LinkGroup) => linkgroups.remove(g));

        (await getItems("tasks"))
            .filter((t: Task) => t.projectId == project.id)
            .forEach((t: Task) => tasks.remove(t));

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
        if (!project?.id) return [];
        const groups = await getItems("linkgroups");

        return groups.filter((group: LinkGroup) => group.projectId = project.id);
    }

    export async function add(linkgroup: LinkGroup): Promise<LinkGroup> {
        linkgroup.id = uuidv4();
        const linkgroups = [...await getItems("linkgroups"), linkgroup];
        storage.sync.set({ linkgroups });

        notify(linkgroup);
        return linkgroup;
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

        (await getItems("links"))
            .filter(l => l.groupId == linkgroup.id)
            .forEach(l => links.remove(l));

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
        if (!group?.projectId) return [];
        return (await getItems("links")).filter((l: Link) => l.groupId == group.id);
    }

    export async function add(link: Link): Promise<Link> {
        link.id = uuidv4();
        const links = [...await getItems("links"), link];
        storage.sync.set({ links });

        notify(link);
        return link;
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
        if (!project?.id) return [];
        
        return (await getItems("tasks")).filter(t => t.projectId = project.id).map(t => {
            t.due = t.due ? new Date(t.due) : null;
            return t;
        });
    }

    export async function add(task: Task): Promise<Task> {
        task.id = uuidv4();
        task.due = task.due.toJSON();
        const tasks = [...await getItems("tasks"), task];
        storage.sync.set({ tasks });

        notify(task);
        return task;
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