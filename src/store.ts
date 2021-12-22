import type { SvelteComponent } from "svelte";
import type { Project } from "./database/database";
import { writable } from "svelte/store";

export const modal = writable<typeof SvelteComponent>();
export const project = writable<Project>(JSON.parse(localStorage.getItem("project")));

project.subscribe(val => {
  localStorage.setItem("project", JSON.stringify(val));
})