import type { IDatabase, IDataGroup, Link, LinkGroup, Project, Task } from "./database";
import lf from "lovefield";

type Callback<T> = (data: T[]) => any;

class ProjectAdapter implements IDataGroup<Project> {
    private db: lf.Database;
    private schema: lf.schema.Table;
    private handlers: Callback<Project>[];

    constructor(db: lf.Database, schema: lf.schema.Table) {
        this.db = db;
        this.schema = schema;
        this.handlers = [];
    }

    async get() {
        return await this.db
            .select()
            .from(this.schema)
            .exec() as Project[];
    };

    async add({ name }: Project) {
        const rows = await this.db
            .insertOrReplace()
            .into(this.schema)
            .values([
                this.schema.createRow({
                    name,
                    used: new Date()
                })
            ]).exec() as Project[];

        this.notify();
        return rows[0];
    };

    async update({ id, name }: Project) {
        const rows = await this.db
            .update(this.schema)
            .set(this.schema.name, name)
            .where(this.schema.id.eq(id))
            .exec() as Project[];

        this.notify();
        return rows[0];
    };

    async remove({id}: Project) {
        this.db
            .delete()
            .from(this.schema)
            .where(this.schema.id.eq(id))
            .exec();

        this.notify();
    }

    private async notify(): Promise<void> {
        const projects = await this.get();
        this.handlers.forEach((item: Function) => item.call(this, projects));
    }

    subscribe(callback: Callback<Project>): void {
        this.handlers.push(callback);
    };

    unsubscribe(callback: Callback<Project>): void {
        this.handlers = this.handlers.filter(
            (item: Callback<Project>): Callback<Project> => {
                if (item !== callback) {
                    return item;
                }
            }
        );
    }
}

class LinkGroupAdapter implements IDataGroup<LinkGroup> {
    private db: lf.Database;
    private schema: lf.schema.Table;
    private handlers: Callback<LinkGroup>[];

    constructor(db: lf.Database, schema: lf.schema.Table) {
        this.db = db;
        this.schema = schema;
        this.handlers = [];
    }

    async get(projectId: number): Promise<LinkGroup[]> {
        return await this.db
            .select()
            .from(this.schema)
            .where(this.schema.projectId.eq(projectId))
            .exec() as LinkGroup[];
    };

    async add({ name, projectId }: LinkGroup): Promise<LinkGroup> {
        const rows = await this.db
            .insertOrReplace()
            .into(this.schema)
            .values([
                this.schema.createRow({
                    name,
                    projectId
                }),
            ])
            .exec() as LinkGroup[];

        this.notify(projectId as number);
        return rows[0];
    };

    async update({ id, name, projectId }: LinkGroup): Promise<LinkGroup> {
        const rows = await this.db
            .update(this.schema)
            .set(this.schema.name, name)
            .where(this.schema.id.eq(id))
            .exec() as LinkGroup[];

        this.notify(projectId as number);
        return rows[0];
    };

    async remove({ id, projectId }: LinkGroup): Promise<void> {
        this.db
            .delete()
            .from(this.schema)
            .where(this.schema.id.eq(id)).exec();

        this.notify(projectId as number);
    }

    private async notify(projectId: number): Promise<void> {
        const linkgroups = await this.get(projectId);
        this.handlers.forEach((item: Callback<LinkGroup>) => item.call(this, linkgroups));
    }

    subscribe(callback: Callback<LinkGroup>): void {
        this.handlers.push(callback);
    };

    unsubscribe(callback: Callback<LinkGroup>): void {
        this.handlers = this.handlers.filter(
            (item: Callback<LinkGroup>): Callback<LinkGroup> => {
                if (item !== callback) {
                    return item;
                }
            }
        );
    }
}

class LinkAdapter implements IDataGroup<Link> {
    private db: lf.Database;
    private schema: lf.schema.Table;
    private handlers: Callback<Link>[];

    constructor(db: lf.Database, linkSchema: lf.schema.Table) {
        this.db = db;
        this.schema = linkSchema;
        this.handlers = [];
    }

    async get(groupId: number): Promise<Link[]> {
        return await this.db
            .select()
            .from(this.schema)
            .where(this.schema.groupId.eq(groupId))
            .exec() as Link[];
    };

    async add({ name, url, groupId }: Link): Promise<Link> {
        const rows = await this.db
            .insertOrReplace()
            .into(this.schema)
            .values([
                this.schema.createRow({
                    name,
                    url,
                    groupId
                }),
            ])
            .exec() as Link[];

        this.notify(groupId as number);
        return rows[0];
    };

    async update({ id, name, url, groupId }: Link): Promise<Link> {
        const rows = await this.db
            .update(this.schema)
            .set(this.schema.name, name)
            .set(this.schema.url, url)
            .set(this.schema.groupId, groupId)
            .where(this.schema.id.eq(id))
            .exec() as Link[];

        this.notify(groupId as number);
        return rows[0];
    };

    async remove({id, groupId}: Link): Promise<void> {
        this.db
            .delete()
            .from(this.schema)
            .where(this.schema.id.eq(id))
            .exec();

        this.notify(groupId as number);
    }

    private async notify(groupId: number): Promise<void> {
        const links = await this.get(groupId);
        this.handlers.forEach((item: Callback<Link>) => item.call(this, links));
    }

    subscribe(callback: Callback<Link>): void {
        this.handlers.push(callback);
    };

    unsubscribe(callback: Callback<Link>): void {
        this.handlers = this.handlers.filter(
            (item: Callback<Link>): Callback<Link> => {
                if (item !== callback) {
                    return item;
                }
            }
        );
    }
}

class TaskAdapter implements IDataGroup<Task> {
    private db: lf.Database;
    private schema: lf.schema.Table;
    private handlers: Callback<Task>[];

    constructor(db: lf.Database, schema: lf.schema.Table) {
        this.db = db;
        this.schema = schema;
        this.handlers = [];
    }

    async get(projectId: number): Promise<Task[]> {
        return await this.db
            .select()
            .from(this.schema)
            .where(this.schema.projectId.eq(projectId))
            .exec() as Task[];
    };

    async add({ name, due, done = false, projectId }: Task): Promise<Task> {
        const rows = await this.db
            .insertOrReplace()
            .into(this.schema)
            .values([
                this.schema.createRow({
                    name,
                    done,
                    due,
                    projectId
                }),
            ])
            .exec() as Task[];

        this.notify(projectId as number);
        return rows[0];
    };

    async update({ id, name, due, done, projectId }: Task): Promise<Task> {
        const rows = await this.db
            .update(this.schema)
            .set(this.schema.name, name)
            .set(this.schema.due, due)
            .set(this.schema.done, done)
            .where(this.schema.id.eq(id))
            .exec() as Task[];

        this.notify(projectId as number);
        return rows[0];
    };

    async remove({id, projectId}: Task): Promise<void> {
        this.db
            .delete()
            .from(this.schema)
            .where(this.schema.id.eq(id))
            .exec();

        this.notify(projectId as number);
    }

    private async notify(projectId: number): Promise<void> {
        const tasks = await this.get(projectId);
        this.handlers.forEach((item: Callback<Task>) => item.call(this, tasks));
    }

    subscribe(callback: Callback<Task>): void {
        this.handlers.push(callback);
    };

    unsubscribe(callback: Callback<Task>): void {
        this.handlers = this.handlers.filter(
            (item: Callback<Task>): Callback<Task> => {
                if (item !== callback) {
                    return item;
                }
            }
        );
    }
}

class LovefieldAdapter implements IDatabase {
    private static instance: LovefieldAdapter;

    projects: ProjectAdapter;
    linkgroups: LinkGroupAdapter;
    links: LinkAdapter;
    tasks: TaskAdapter;

    constructor(db: lf.Database) {
        const projectSchema = db.getSchema().table("Projects");
        const linkGroupSchema = db.getSchema().table("LinkGroups");
        const linkSchema = db.getSchema().table("Links");
        const taskSchema = db.getSchema().table("Tasks");

        this.projects = new ProjectAdapter(db, projectSchema);
        this.linkgroups = new LinkGroupAdapter(db, linkGroupSchema);
        this.links = new LinkAdapter(db, linkSchema);
        this.tasks = new TaskAdapter(db, taskSchema);
    }

    private static async init() {
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
        return new LovefieldAdapter(db);
    }

    public static async getInstance() {
        if (!LovefieldAdapter.instance) {
            LovefieldAdapter.instance = await LovefieldAdapter.init();
        }

        return LovefieldAdapter.instance;
    }
}

export default LovefieldAdapter;