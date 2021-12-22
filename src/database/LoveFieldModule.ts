import type lf from "lovefield";
import type { Link, LinkGroup, Project, Task } from "./database";

type fnCallback = (data: Project[] | LinkGroup[] | Link[] | Task[]) => void;

export module projects {
    let handlers: fnCallback[] = [];

    export async function get(db: lf.Database): Promise<Project[]> {
        const schema = db.getSchema().table("Projects");

        return await db
            .select()
            .from(schema)
            .exec() as Project[];
    }

    export async function add(db: lf.Database, project: Project): Promise<Project> {
        const schema = db.getSchema().table("Projects");

        const rows = await db
            .insertOrReplace()
            .into(schema)
            .values([
                schema.createRow({
                    name: project.name,
                    used: new Date()
                })
            ]).exec() as Project[];

        notify(db);
        return rows[0];
    }

    export async function update(db: lf.Database, project: Project): Promise<Project> {
        const schema = db.getSchema().table("Projects");

        const rows = await db
            .update(schema)
            .set(schema.name, project.name)
            .where(schema.id.eq(project.id))
            .exec() as Project[];

        notify(db);
        return rows[0];
    }

    export async function remove(db: lf.Database, project: Project): Promise<void> {
        const schema = db.getSchema().table("Projects");

        await db
            .delete()
            .from(schema)
            .where(schema.id.eq(project.id))
            .exec();

        notify(db);
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

    async function notify(db: lf.Database): Promise<void> {
        const rows = await get(db);
        handlers.forEach(async (item: Function) => item.call(projects, rows));
    }
}

export module linkgroups {
    let handlers: fnCallback[] = [];

    export async function get(db: lf.Database, projectId: number): Promise<LinkGroup[]> {
        const schema = db.getSchema().table("Projects");

        return await db
            .select()
            .from(schema)
            .where(schema.projectId.eq(projectId))
            .exec() as LinkGroup[];
    }

    export async function add(db: lf.Database, linkgroup: LinkGroup): Promise<LinkGroup> {
        const schema = db.getSchema().table("Projects");

        const rows = await db
            .insertOrReplace()
            .into(schema)
            .values([
                schema.createRow({
                    name: linkgroup.name,
                    projectId: linkgroup.projectId
                }),
            ])
            .exec() as LinkGroup[];

        notify(db, linkgroup.projectId as number);
        return rows[0];
    }

    export async function update(db: lf.Database, linkgroup: LinkGroup): Promise<LinkGroup> {
        const schema = db.getSchema().table("Projects");

        const rows = await db
            .update(schema)
            .set(schema.name, linkgroup.name)
            .where(schema.id.eq(linkgroup.id))
            .exec() as LinkGroup[];

        notify(db, linkgroup.projectId as number);
        return rows[0];
    }

    export async function remove(db: lf.Database, linkgroup: LinkGroup): Promise<void> {
        const schema = db.getSchema().table("Projects");

        await db
            .delete()
            .from(schema)
            .where(schema.id.eq(linkgroup.id)).exec();

        notify(db, linkgroup.projectId as number);
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

    async function notify(db: lf.Database, projectId: number): Promise<void> {
        const rows = await get(db, projectId);
        handlers.forEach((item: fnCallback): void => item.call(links, rows));
    }
}

export module links {
    let handlers: fnCallback[] = [];

    export async function get(db: lf.Database, groupId: number): Promise<Link[]> {
        const schema = db.getSchema().table("Projects");

        return await db
            .select()
            .from(schema)
            .where(schema.groupId.eq(groupId))
            .exec() as Link[];
    }

    export async function add(db: lf.Database, link: Link): Promise<Link> {
        const schema = db.getSchema().table("Projects");

        const rows = await db
            .insertOrReplace()
            .into(schema)
            .values([
                schema.createRow({
                    name: link.name,
                    url: link.url,
                    groupId: link.groupId
                }),
            ])
            .exec() as Link[];

        notify(db, link.groupId as number);
        return rows[0];
    }

    export async function update(db: lf.Database,  link: Link): Promise<Link> {
        const schema = db.getSchema().table("Projects");

        const rows = await db
            .update(schema)
            .set(schema.name, link.name)
            .set(schema.url, link.url)
            .set(schema.groupId, link.groupId)
            .where(schema.id.eq(link.id))
            .exec() as Link[];

        notify(db, link.groupId as number);
        return rows[0];
    }

    export async function remove(db: lf.Database, link: Link): Promise<void> {
        const schema = db.getSchema().table("Projects");

        await db
            .delete()
            .from(schema)
            .where(schema.id.eq(link.id))
            .exec();

        notify(db, link.groupId as number);
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

    async function notify(db: lf.Database, groupId: number): Promise<void> {
        const links = await get(db, groupId);
        handlers.forEach((item: fnCallback) => item.call(links, links));
    }
}

export module tasks {
    let handlers: fnCallback[] = [];

    export async function get(db: lf.Database, projectId: number): Promise<Task[]> {
        const schema = db.getSchema().table("Projects");

        return await db
            .select()
            .from(schema)
            .where(schema.projectId.eq(projectId))
            .exec() as Task[];
    }

    export async function add(db: lf.Database, task: Task): Promise<Task> {
        const schema = db.getSchema().table("Projects");

        const rows = await db
            .insertOrReplace()
            .into(schema)
            .values([
                schema.createRow({
                    name: task.name,
                    done: task.done,
                    due: task.due,
                    projectId: task.projectId
                }),
            ])
            .exec() as Task[];

        notify(db, task.projectId as number);
        return rows[0];
    }

    export async function update(db: lf.Database, task: Task): Promise<Task> {
        const schema = db.getSchema().table("Projects");

        const rows = await db
            .update(schema)
            .set(schema.name, task.name)
            .set(schema.due, task.due)
            .set(schema.done, task.done)
            .where(schema.id.eq(task.id))
            .exec() as Task[];

        notify(db, task.projectId as number);
        return rows[0];
    }

    export async function remove(db: lf.Database, task: Task): Promise<void> {
        const schema = db.getSchema().table("Projects");

        await db
            .delete()
            .from(schema)
            .where(schema.id.eq(task.id))
            .exec();

        notify(db, task.projectId as number);
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

    async function notify(db: lf.Database, projectId: number): Promise<void> {
        const tasks = await get(db, projectId);
        handlers.forEach((item: fnCallback) => item.call(tasks, tasks));
    }
}