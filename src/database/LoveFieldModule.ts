import lf from "lovefield";
import type { Link, LinkGroup, Project, Task } from "./database";

type fnCallback = (data: Project[] | LinkGroup[] | Link[] | Task[]) => void;

const schemabuilder = lf.schema.create("workpage", 1);
schemabuilder
    .createTable("Projects")
    .addColumn("id", lf.Type.INTEGER)
    .addColumn("name", lf.Type.STRING)
    .addColumn("used", lf.Type.DATE_TIME)
    .addPrimaryKey(["id"], true);

schemabuilder
    .createTable("LinkGroups")
    .addColumn("id", lf.Type.INTEGER)
    .addColumn("name", lf.Type.STRING)
    .addColumn("projectId", lf.Type.INTEGER)
    .addPrimaryKey(["id"], true)
    .addForeignKey("fk_Project", {
        local: "projectId",
        ref: "Projects.id",
        action: lf.ConstraintAction.CASCADE,
    });

schemabuilder
    .createTable("Links")
    .addColumn("id", lf.Type.INTEGER)
    .addColumn("name", lf.Type.STRING)
    .addColumn("url", lf.Type.STRING)
    .addColumn("groupId", lf.Type.INTEGER)
    .addPrimaryKey(["id"], true)
    .addForeignKey("fk_LinkId", {
        local: "groupId",
        ref: "LinkGroups.id",
        action: lf.ConstraintAction.CASCADE,
    });

schemabuilder
    .createTable("Tasks")
    .addColumn("id", lf.Type.INTEGER)
    .addColumn("name", lf.Type.STRING)
    .addColumn("done", lf.Type.BOOLEAN)
    .addColumn("due", lf.Type.DATE_TIME)
    .addColumn("projectId", lf.Type.INTEGER)
    .addNullable(["due"])
    .addPrimaryKey(["id"], true)
    .addForeignKey("fk_Project", {
        local: "projectId",
        ref: "Projects.id",
        action: lf.ConstraintAction.CASCADE,
    });

    const db = await schemabuilder.connect();

    const projectschema = db.getSchema().table("Projects");
    const linkgroupschema = db.getSchema().table("LinkGroups");
    const linkschema = db.getSchema().table("Links");
    const taskschema = db.getSchema().table("Tasks");


export module projects {
    let handlers: fnCallback[] = [];

    export async function get(): Promise<Project[]> {
        return await db
            .select()
            .from(projectschema)
            .exec() as Project[];
    }

    export async function add(project: Project): Promise<Project> {
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

        notify();
        return rows[0];
    }

    export async function update(project: Project): Promise<Project> {
        const rows = await db
            .update(projectschema)
            .set(projectschema.name, project.name)
            .where(projectschema.id.eq(project.id))
            .exec() as Project[];

        notify();
        return rows[0];
    }

    export async function remove(project: Project): Promise<void> {
        await db
            .delete()
            .from(projectschema)
            .where(projectschema.id.eq(project.id))
            .exec();

        notify();
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

    async function notify(): Promise<void> {
        const rows = await get();
        handlers.forEach(async (item: Function) => item.call(projects, rows));
    }
}

export module linkgroups {
    let handlers: fnCallback[] = [];

    export async function get(projectId: number): Promise<LinkGroup[]> {
        return await db
            .select()
            .from(linkgroupschema)
            .where(linkgroupschema.projectId.eq(projectId))
            .exec() as LinkGroup[];
    }

    export async function add(linkgroup: LinkGroup): Promise<LinkGroup> {
        const rows = await db
            .insertOrReplace()
            .into(linkgroupschema)
            .values([
                linkgroupschema.createRow({
                    name: linkgroup.name,
                    projectId: linkgroup.projectId
                }),
            ])
            .exec() as LinkGroup[];

        notify(linkgroup.projectId as number);
        return rows[0];
    }

    export async function update(linkgroup: LinkGroup): Promise<LinkGroup> {
        const rows = await db
            .update(linkgroupschema)
            .set(linkgroupschema.name, linkgroup.name)
            .where(linkgroupschema.id.eq(linkgroup.id))
            .exec() as LinkGroup[];

        notify(linkgroup.projectId as number);
        return rows[0];
    }

    export async function remove(linkgroup: LinkGroup): Promise<void> {
        await db
            .delete()
            .from(linkgroupschema)
            .where(linkgroupschema.id.eq(linkgroup.id)).exec();

        notify(linkgroup.projectId as number);
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

    async function notify(projectId: number): Promise<void> {
        const rows = await get(projectId);
        handlers.forEach((item: fnCallback): void => item.call(links, rows));
    }
}

export module links {
    let handlers: fnCallback[] = [];

    export async function get(groupId: number): Promise<Link[]> {
        return await db
            .select()
            .from(linkschema)
            .where(linkschema.groupId.eq(groupId))
            .exec() as Link[];
    }

    export async function add(link: Link): Promise<Link> {
        const rows = await db
            .insertOrReplace()
            .into(linkschema)
            .values([
                linkschema.createRow({
                    name: link.name,
                    url: link.url,
                    groupId: link.groupId
                }),
            ])
            .exec() as Link[];

        notify(link.groupId as number);
        return rows[0];
    }

    export async function update(link: Link): Promise<Link> {
        const rows = await db
            .update(linkschema)
            .set(linkschema.name, link.name)
            .set(linkschema.url, link.url)
            .set(linkschema.groupId, link.groupId)
            .where(linkschema.id.eq(link.id))
            .exec() as Link[];

        notify(link.groupId as number);
        return rows[0];
    }

    export async function remove(link: Link): Promise<void> {
        await db
            .delete()
            .from(linkschema)
            .where(linkschema.id.eq(link.id))
            .exec();

        notify(link.groupId as number);
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

    async function notify(groupId: number): Promise<void> {
        const links = await get(groupId);
        handlers.forEach((item: fnCallback) => item.call(links, links));
    }
}

export module tasks {
    let handlers: fnCallback[] = [];

    export async function get(projectId: number): Promise<Task[]> {
        return await db
            .select()
            .from(taskschema)
            .where(taskschema.projectId.eq(projectId))
            .exec() as Task[];
    }

    export async function add(task: Task): Promise<Task> {
        const rows = await db
            .insertOrReplace()
            .into(taskschema)
            .values([
                taskschema.createRow({
                    name: task.name,
                    done: task.done,
                    due: task.due,
                    projectId: task.projectId
                }),
            ])
            .exec() as Task[];

        notify(task.projectId as number);
        return rows[0];
    }

    export async function update(task: Task): Promise<Task> {
        const rows = await db
            .update(taskschema)
            .set(taskschema.name, task.name)
            .set(taskschema.due, task.due)
            .set(taskschema.done, task.done)
            .where(taskschema.id.eq(task.id))
            .exec() as Task[];

        notify(task.projectId as number);
        return rows[0];
    }

    export async function remove(task: Task): Promise<void> {
        await db
            .delete()
            .from(taskschema)
            .where(taskschema.id.eq(task.id))
            .exec();

        notify(task.projectId as number);
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

    async function notify(projectId: number): Promise<void> {
        const tasks = await get(projectId);
        handlers.forEach((item: fnCallback) => item.call(tasks, tasks));
    }
}