import type { SvelteComponent } from "svelte";
import type { Project } from "./database/database";
import { writable } from "svelte/store";

export const modal = writable<typeof SvelteComponent>();
export const editRef = writable();

export const project = writable<Project>(JSON.parse(localStorage.getItem("project")));
export const darkmode = writable<boolean>(JSON.parse(localStorage.getItem("darkmode")) ?? false);

project.subscribe(val => {
    localStorage.setItem("project", JSON.stringify(val));
})