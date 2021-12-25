export type Project = {
    id?: string | number;
    name: string;
    used?: Date;
}

export type LinkGroup = {
    id?: string | number;
    name: string;
    projectId?: string | number;
}

export type Link = {
    id?: string | number;
    name: string;
    url: string;
    groupId?: string | number;
}

export type Task = {
    id?: string | number;
    name: string;
    due?: Date;
    done?: Date;
    projectId?: string | number;
}

export type fnCallback = (obj: Project | LinkGroup | Link | Task) => Promise<any>;

export interface IDataGroup<T> {
    get(parent?: Project | LinkGroup): Promise<T[]>;
    add(obj: T): Promise<T>;
    update(obj: T): Promise<T>;
    remove(obj: T): Promise<void>;

    subscribe(callback: fnCallback): void;
    unsubscribe(callback: fnCallback): void;
}

export interface IDatabase {
    projects: IDataGroup<Project>;
    linkgroups: IDataGroup<LinkGroup>;
    links: IDataGroup<Link>;
    tasks: IDataGroup<Task>;
}

// Example
class GenericAdapter implements IDatabase {
    projects = {
        _handlers: [] as Function[],
        _projects: [] as Project[],
        async get() { return this._projects },
        async add({ name, used }: Project) { 
            const newproject: Project = { id: "abc", name, used };
            this._projects.push(newproject);
            return newproject; 
        },
        async update(project: Project) { return project },
        async remove({id}: Project) { },
        
        subscribe(callback: Function): void {
            this._handlers.push(callback);
        },
        unsubscribe(callback: Function): void {
            this._handlers = this._handlers.filter(
                (item: Function): Function => {
                    if (item !== callback) {
                        return item;
                    }
                }
            );
        }
    };

    linkgroups = {
        _handlers: [] as Function[],
        _linkGroups: [] as LinkGroup[],
        async get() { return this._linkgroups; },
        async add({ name, projectId }: LinkGroup) { 
            const newLinkGroup = { id: "abs", name, projectId };
            this._linkGroups.push(newLinkGroup);
            return newLinkGroup;
        },
        async update(linkGroup: LinkGroup) { return linkGroup },
        async remove({id}: LinkGroup) { },
        
        subscribe(callback: Function) {
            this._handlers.push(callback);
        },
        unsubscribe(callback: Function) {
            this._handlers = this._handlers.filter(
                (item: Function): Function => {
                    if (item !== callback) {
                        return item;
                    }
                }
            );
        }
    };

    links = {
        _handlers: [] as Function[],
        _links: [] as Link[],
        async get() { return this._links },
        async add({ name, url, groupId }: Link) { 
            const newLink = { id: "abc", name,  url, groupId };
            this._links.push(newLink);
            return newLink;
        },
        async update(link: Link) { return link },
        async remove({id}: Link) { },

        subscribe(callback: Function) {
            this._handlers.push(callback);
        },
        unsubscribe(callback: Function) {
            this._handlers = this._handlers.filter(
                (item: Function): Function => {
                    if (item !== callback) {
                        return item;
                    }
                }
            );
        }
    };

    tasks = {
        _handlers: [] as Function[],
        _tasks: [] as Task[],
        async get() { return [] },
        async add({ name, due, done, projectId }: Task) {
            const newTask = { id: "abc", name, due, done, projectId };
            this._tasks.push(newTask);
            return newTask;
        },
        async update(task: Task) { return task },
        async remove({id}: Task) { },
        
        subscribe(callback: Function) {
            this._handlers.push(callback);
        },
        unsubscribe(callback: Function) {
            this._handlers = this._handlers.filter(
                (item: Function): Function => {
                    if (item !== callback) {
                        return item;
                    }
                }
            );
        }
    };
}
