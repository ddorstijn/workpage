import type { IDatabase, IDataGroup, Link, LinkGroup, Project, Task } from "./database";
import lf from "lovefield";

class ProjectAdapter implements IDataGroup<Project> {
    private db: lf.Database;
    private schema: lf.schema.Table;
    private handlers: Function[];

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

        this.notifyAll();
        return rows[0];
    };

    async update({ id, name }: Project): Promise<Project> {
        const rows = await this.db
            .update(this.schema)
            .set(this.schema.name, name)
            .where(this.schema.id.eq(id))
            .exec() as Project[];

        this.notifyAll();
        return rows[0];
    };

    async remove(id: number) {
        this.db
            .delete()
            .from(this.schema)
            .where(this.schema.id.eq(id))
            .exec();

        this.notifyAll();
    }

    private notifyAll() {
        this.get().then(data => {
            this.handlers.forEach((item: Function) =>
                item.call(this, data)
            );
        })
    }

    private notifyOne(callback: Function): void {
        this.get().then((data: Project[]): void => {
            callback.call(this, data);
        })
    };

    subscribe(callback: Function): void {
        this.handlers.push(callback);
        this.notifyOne(callback);
    };

    unsubscribe(callback: Function): void {
        this.handlers = this.handlers.filter(
            (item: Function): Function => {
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
    private handlers: Function[];

    constructor(db: lf.Database, schema: lf.schema.Table) {
        this.db = db;
        this.schema = schema;
        this.handlers = [];
    }

    async get(project: Project): Promise<LinkGroup[]> {
        return await this.db
            .select()
            .from(this.schema)
            .where(this.schema.projectId.eq(project.id))
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

        this.notifyAll(rows[0]);
        return rows[0];
    };

    async update({ id, name }: LinkGroup): Promise<LinkGroup> {
        const rows = await this.db
            .update(this.schema)
            .set(this.schema.name, name)
            .where(this.schema.id.eq(id))
            .exec() as LinkGroup[];

        this.notifyAll(rows[0]);
        return rows[0];
    };

    async remove(id: number): Promise<void> {
       const rows = await this.db
            .delete()
            .from(this.schema)
            .where(this.schema.id.eq(id))
            .exec() as LinkGroup[];

        this.notifyAll(rows[0]);
    }

    private notifyAll(project: Project): void {
        this.get(project).then(data => {
            this.handlers.forEach((item: Function) =>
                item.call(this, data)
            );
        })
    }

    private notifyOne(callback: Function): void {
        this.get().then(data => {
            callback.call(this, data)
        })
    };

    subscribe(callback: Function): void {
        this.handlers.push(callback);
        this.notifyOne(callback);
    };

    unsubscribe(callback: Function): void {
        this.handlers = this.handlers.filter(
            (item: Function): Function => {
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
    private handlers: Function[];

    constructor(db: lf.Database, linkSchema: lf.schema.Table) {
        this.db = db;
        this.schema = linkSchema;
        this.handlers = [];
    }

    async get(linkGroup: LinkGroup): Promise<Link[]> {
        return await this.db
            .select()
            .from(this.schema)
            .where(this.schema.groupId.eq(linkGroup.id))
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

        this.notifyAll();
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

        this.notifyAll();
        return rows[0];
    };

    async remove(id: number): Promise<void> {
        this.db
            .delete()
            .from(this.schema)
            .where(this.schema.id.eq(id))
            .exec();

        this.notifyAll();
    }

    private notifyAll(linkGroup: LinkGroup): void {
        this.get(linkGroup).then(data => {
            this.handlers.forEach((item: Function) =>
                item.call(this, data)
            );
        })
    }

    private notifyOne(callback: Function, linkGroup: LinkGroup): void {
        this.get(linkGroup).then(data => {
            callback.call(this, data)
        })
    };

    subscribe(callback: Function): void {
        this.handlers.push(callback);
        this.notifyOne(callback);
    };

    unsubscribe(callback: Function): void {
        this.handlers = this.handlers.filter(
            (item: Function): Function => {
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
    private handlers: Function[];

    constructor(db: lf.Database, schema: lf.schema.Table) {
        this.db = db;
        this.schema = schema;
        this.handlers = [];
    }

    async get(project: Project): Promise<Task[]> {
        return await this.db
            .select()
            .from(this.schema)
            .where(this.schema.projectId.eq(project.id))
            .exec() as Task[];
    };

    async add({ name, done, due, projectId }: Task): Promise<Task> {
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

        this.notifyAll();
        return rows[0];
    };

    async update({ id, name, due, done }: Task): Promise<Task> {
        const rows = await this.db
            .update(this.schema)
            .set(this.schema.title, name)
            .set(this.schema.due, due)
            .set(this.schema.done, done)
            .where(this.schema.id.eq(id))
            .exec() as Task[];

        this.notifyAll();
        return rows[0];
    };

    async remove(id: number): Promise<void> {
        this.db
            .delete()
            .from(this.schema)
            .where(this.schema.id.eq(id))
            .exec();

        this.notifyAll();
    }

    private notifyAll(): void {
        this.get().then(data => {
            this.handlers.forEach((item: Function) =>
                item.call(this, data)
            );
        })
    }

    private notifyOne(callback: Function): void {
        this.get().then(data => {
            callback.call(this, data)
        })
    };

    subscribe(callback: Function): void {
        this.handlers.push(callback);
        this.notifyOne(callback);
    };

    unsubscribe(callback: Function): void {
        this.handlers = this.handlers.filter(
            (item: Function): Function => {
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
            .addColumn("title", lf.Type.STRING)
            .addColumn("done", lf.Type.BOOLEAN)
            .addColumn("due", lf.Type.DATE_TIME)
            .addColumn("projectId", lf.Type.INTEGER)
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