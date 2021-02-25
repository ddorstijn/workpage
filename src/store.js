import { get, writable } from "svelte/store";
import { usePrevious } from 'svelte-previous';

export const [activeId, p_activeId] = usePrevious(localStorage.getItem("activeProjectID") || 0);
export const currentID = writable(localStorage.getItem("currentID") || 0);
export const timer = writable({running: false, sessions: []});

activeId.subscribe(val => localStorage.setItem("activeProjectID", val));
currentID.subscribe(val => localStorage.setItem("currentID", val));
timer.subscribe(val => localStorage.setItem(`timer${get(activeId)}`, JSON.stringify(val)));
