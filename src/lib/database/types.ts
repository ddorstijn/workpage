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
    priority?: number;
    done?: Date;
    projectId?: string | number;
}

export type fnCallback = (obj: Project | LinkGroup | Link | Task) => Promise<any>;