import { get, writable } from "svelte/store";

export const activeProjectID = writable(localStorage.getItem("activeProjectID") || 0);
export const currentID = writable(localStorage.getItem("currentID") || 0);
export const timer = writable({running: false, sessions: []});

activeProjectID.subscribe(val => localStorage.setItem("activeProjectID", val));
currentID.subscribe(val => localStorage.setItem("currentID", val));
timer.subscribe(val => localStorage.setItem(`timer${get(activeProjectID)}`, JSON.stringify(val)));
