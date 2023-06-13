export type Project = {
    last_used: Date,
    todo: Todo[],
    done: Done[],
    linksgroups: LinkGroup[],
}

export type LinkGroup = {
    title: string,
    color: string,
    links: Link[] 
}

export type Link = {
    alias: string,
    url: string
}

export type Todo = {
    title: string,
    due?: Date
}

export type Done = {
    title: string,
    done: Date
}
