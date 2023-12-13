type Link = { name: string, url: URL };

type LinkGroup = { name: string, color: string, links: Link[] };

type Task = { name: string };

type Project = { used: Date, todo: Task[], done: Task[], linkgroups: Linkgroup[] };