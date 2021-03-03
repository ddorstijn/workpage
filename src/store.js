import { get, writable } from "svelte/store";

export const activeId = writable(localStorage.getItem("activeProjectID") || 0);
export const currentID = writable(localStorage.getItem("currentID") || 0);
export const timerRunning = writable(false);

activeId.subscribe(val => localStorage.setItem("activeProjectID", val));
currentID.subscribe(val => localStorage.setItem("currentID", val));
