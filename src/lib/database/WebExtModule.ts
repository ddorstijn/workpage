import { storage } from "webextension-polyfill";
import type { fnCallback, Link, LinkGroup, Project, Task } from "./types";

type SProject = {
  id: string;
  name: string;
  used: string;
};

type STask = {
  id: string;
  name: string;
  due?: string;
  done?: string;
  priority?: number;
  projectId: string;
};

async function getItems<T>(table: string): Promise<T[]> {
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
    const projects = (await getItems<Project>("projects")).map((p) => {
      p.used = new Date(p.used);
      return p;
    });

    if (project) {
      const p = projects.find((p) => p.id == project.id);
      return p ? [p] : [];
    }

    return projects;
  }

  export async function add(project: Project): Promise<Project> {
    project.id = Date.now().toString();
    project.used = new Date();

    const p: SProject = {
      id: project.id,
      name: project.name,
      used: project.used.toJSON(),
    };
    const projects = [...(await getItems<SProject>("projects")), p];
    storage.sync.set({ projects });

    notify(project);
    return project;
  }

  export async function update(project: Project): Promise<void> {
    if (!project?.id) return;

    const p: SProject = {
      id: project.id as string,
      name: project.name,
      used: project.used.toJSON(),
    };

    const projects = await getItems<SProject>("projects");
    const idx = projects.findIndex((p) => p.id == project.id);
    projects[idx] = p;
    await storage.sync.set({ projects });

    notify(project);
  }

  export async function remove(project: Project): Promise<void> {
    if (!project?.id) return;

    const projects = await getItems<SProject>("projects");
    const idx = projects.findIndex((p) => p.id == project.id);
    projects.splice(idx, 1);
    await storage.sync.set({ projects });

    const aGroups = (await getItems<LinkGroup>("linkgroups")).filter(
      (g: LinkGroup) => g.projectId == project.id
    );
    for (const group of aGroups) {
      await linkgroups.remove(group);
    }

    const aTasks = (await getItems<Task>("tasks")).filter(
      (t) => t.projectId == project.id
    );

    for (const task of aTasks) {
      await tasks.remove(task);
    }

    notify(project);
  }

  export function subscribe(callback: fnCallback): void {
    handlers.push(callback);
  }

  export function unsubscribe(callback: fnCallback): void {
    handlers = handlers.filter((item: fnCallback): fnCallback => {
      if (item !== callback) {
        return item;
      }
    });
  }

  function notify(project: Project): void {
    handlers.forEach(async (item: Function) => item.call(projects, project));
  }
}

export module linkgroups {
  let handlers: fnCallback[] = [];

  export async function get(project: Project): Promise<LinkGroup[]> {
    if (!project?.id) return [];
    const groups = await getItems<LinkGroup>("linkgroups");

    return groups.filter((group: LinkGroup) => group.projectId == project.id);
  }

  export async function add(linkgroup: LinkGroup): Promise<LinkGroup> {
    linkgroup.id = Date.now().toString();
    const linkgroups = [
      ...(await getItems<LinkGroup>("linkgroups")),
      linkgroup,
    ];
    storage.sync.set({ linkgroups });

    notify(linkgroup);
    return linkgroup;
  }

  export async function update(linkgroup: LinkGroup): Promise<void> {
    if (!linkgroup?.id) return;

    const linkgroups = await getItems<LinkGroup>("linkgroups");
    const idx = linkgroups.findIndex((group) => group.id == linkgroup.id);
    linkgroups[idx] = linkgroup;
    await storage.sync.set({ linkgroups });

    notify(linkgroup);
  }

  export async function remove(linkgroup: LinkGroup): Promise<void> {
    if (!linkgroup?.id) return;

    const linkgroups = await getItems<LinkGroup>("linkgroups");
    const idx = linkgroups.findIndex((group) => group.id == linkgroup.id);
    linkgroups.splice(idx, 1);
    await storage.sync.set({ linkgroups });

    const aLinks = (await getItems<Link>("links")).filter(
      (l) => l.groupId == linkgroup.id
    );
    for (const link of aLinks) {
      await links.remove(link);
    }

    notify(linkgroup);
  }

  export function subscribe(callback: fnCallback): number {
    return handlers.push(callback);
  }

  export function unsubscribe(callback: fnCallback): void {
    handlers = handlers.filter((item: fnCallback): fnCallback => {
      if (item !== callback) {
        return item;
      }
    });
  }

  function notify(linkgroup: LinkGroup): void {
    handlers.forEach((item: fnCallback): void => item.call(links, linkgroup));
  }
}

export module links {
  let handlers: fnCallback[] = [];

  storage.onChanged.addListener((changes) => {
    const changedItems = Object.keys(changes);

    for (const item of changedItems) {
      if (item == "links" && changes[item].newValue) {
        changes[item].newValue
          .filter((i: Link) => !changes[item].oldValue?.includes(i))
          .forEach((l: Link) => notify(l));
      }
    }
  });

  export async function get(group: LinkGroup): Promise<Link[]> {
    if (!group?.projectId) return [];

    return (await getItems<Link>("links")).filter(
      (l: Link) => l.groupId == group.id
    );
  }

  export async function add(link: Link): Promise<Link> {
    link.id = Date.now().toString();
    const links = [...(await getItems<Link>("links")), link];
    storage.sync.set({ links });

    notify(link);
    return link;
  }

  export async function update(link: Link): Promise<void> {
    if (!link?.id) return;

    const links = await getItems<Link>("links");
    const idx = links.findIndex((l) => l.id == link.id);
    links[idx] = link;
    await storage.sync.set({ links });

    notify(link);
  }

  export async function remove(link: Link): Promise<void> {
    if (!link?.id) return;

    const links = await getItems<Link>("links");
    const idx = links.findIndex((l) => l.id == link.id);
    links.splice(idx, 1);
    await storage.sync.set({ links });

    notify(link);
  }

  export function subscribe(callback: fnCallback): void {
    handlers.push(callback);
  }

  export function unsubscribe(callback: fnCallback): void {
    handlers = handlers.filter((item: fnCallback): fnCallback => {
      if (item !== callback) {
        return item;
      }
    });
  }

  function notify(link: Link): void {
    handlers.forEach((item: fnCallback) => item.call(links, link));
  }
}

export module tasks {
  let handlers: fnCallback[] = [];

  export async function get(project: Project): Promise<Task[]> {
    if (!project?.id) return [];

    return (await getItems<STask>("tasks"))
      .filter((t) => t.projectId == project.id)
      .map(({ id, name, priority, due: dueStr, done: doneStr, projectId }) => {
        let due = dueStr ? new Date(dueStr) : null;
        let done = doneStr ? new Date(doneStr) : null;
        return { id, name, priority, due, done, projectId } as Task;
      });
  }

  export async function add(task: Task): Promise<Task> {
    task.id = Date.now().toString();

    const t: STask = {
      id: task.id,
      name: task.name,
      priority: task.priority,
      due: task.due?.toString(),
      done: task.done?.toString(),
      projectId: task.projectId as string,
    };

    const tasks = [...(await getItems<STask>("tasks")), t];
    storage.sync.set({ tasks });

    notify(task);
    return task;
  }

  export async function update(task: Task): Promise<void> {
    if (!task?.id) return;

    const t: STask = {
      id: task.id as string,
      name: task.name,
      priority: task.priority,
      due: task.due?.toString(),
      done: task.done?.toString(),
      projectId: task.projectId as string,
    };

    const tasks = await getItems<STask>("tasks");
    const idx = tasks.findIndex((t) => t.id == task.id);
    tasks[idx] = t;
    await storage.sync.set({ tasks });

    notify(task);
  }

  export async function remove(task: Task): Promise<void> {
    if (!task?.id) return;

    const tasks = await getItems<STask>("tasks");
    const idx = tasks.findIndex((t) => t.id == task.id);
    tasks.splice(idx, 1);
    await storage.sync.set({ tasks });

    notify(task);
  }

  export function subscribe(callback: fnCallback): void {
    handlers.push(callback);
  }

  export function unsubscribe(callback: fnCallback): void {
    handlers = handlers.filter((item: fnCallback): fnCallback => {
      if (item !== callback) {
        return item;
      }
    });
  }

  function notify(task: Task): void {
    handlers.forEach((item: fnCallback) => item.call(tasks, task));
  }
}
