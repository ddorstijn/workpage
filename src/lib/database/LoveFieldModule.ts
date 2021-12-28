import lf from "lovefield";
import type { fnCallback, Link, LinkGroup, Project, Task } from "./types";

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
    .addColumn("due", lf.Type.DATE_TIME)
    .addColumn("done", lf.Type.DATE_TIME)
    .addColumn("priority", lf.Type.INTEGER)
    .addColumn("projectId", lf.Type.INTEGER)
    .addNullable(["due", "done"])
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

    export async function get(project?: Project): Promise<Project[]> {
        if (project) {
            return await db
            .select()
            .from(projectschema)
            .where(projectschema.id.eq(project.id))
            .exec() as Project[];
        }

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

        notify(project);
        return rows[0];
    }

    export async function update(project: Project): Promise<Project> {
        const rows = await db
            .update(projectschema)
            .set(projectschema.name, project.name)
            .where(projectschema.id.eq(project.id))
            .exec() as Project[];

        notify(project);
        return rows[0];
    }

    export async function remove(project: Project): Promise<void> {
        await db
            .delete()
            .from(projectschema)
            .where(projectschema.id.eq(project.id))
            .exec();

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
        return await db
            .select()
            .from(linkgroupschema)
            .where(linkgroupschema.projectId.eq(project.id))
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

        notify(linkgroup);
        return rows[0];
    }

    export async function update(linkgroup: LinkGroup): Promise<LinkGroup> {
        const rows = await db
            .update(linkgroupschema)
            .set(linkgroupschema.name, linkgroup.name)
            .where(linkgroupschema.id.eq(linkgroup.id))
            .exec() as LinkGroup[];

        notify(linkgroup);
        return rows[0];
    }

    export async function remove(linkgroup: LinkGroup): Promise<void> {
        await db
            .delete()
            .from(linkgroupschema)
            .where(linkgroupschema.id.eq(linkgroup.id)).exec();

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
        return await db
            .select()
            .from(linkschema)
            .where(linkschema.groupId.eq(group.id))
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

        notify(link);
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

        notify(link);
        return rows[0];
    }

    export async function remove(link: Link): Promise<void> {
        await db
            .delete()
            .from(linkschema)
            .where(linkschema.id.eq(link.id))
            .exec();

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
        return await db
            .select()
            .from(taskschema)
            .where(taskschema.projectId.eq(project.id))
            .orderBy(taskschema.due,lf.Order.DESC)
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
                    priority: task.priority,
                    projectId: task.projectId
                }),
            ])
            .exec() as Task[];

        notify(task);
        return rows[0];
    }

    export async function update(task: Task): Promise<Task> {
        const rows = await db
            .update(taskschema)
            .set(taskschema.name, task.name)
            .set(taskschema.due, task.due)
            .set(taskschema.done, task.done)
            .set(taskschema.priority, task.priority)
            .where(taskschema.id.eq(task.id))
            .exec() as Task[];

        notify(task);
        return rows[0];
    }

    export async function remove(task: Task): Promise<void> {
        await db
            .delete()
            .from(taskschema)
            .where(taskschema.id.eq(task.id))
            .exec();

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