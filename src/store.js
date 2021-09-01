import { writable } from "svelte/store";
import Database from "./database.js";

export const activeProject = writable();
activeProject.subscribe(val => {
	if (!val) return;
	localStorage.setItem("active", val);
})

export const activeModal = writable();

export const loaded = async () => {
	try {
		await Database.init();
		await Database.generate_testdata();
	
		const active = localStorage.getItem("active");
		active && activeProject.set(active);

		return true;
	} catch (error) {
		console.log(error);
		return error;
	}
};

