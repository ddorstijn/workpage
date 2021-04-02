import { writable } from "svelte/store";

export const activeId = writable();
export const currentId = writable();
export const projects = writable();
activeId.subscribe(val => {
	if (!val) return;
	chrome.storage.sync.set({ activeId: val });
});

currentId.subscribe(val => {
	if (!val) return;
	chrome.storage.sync.set({ currentId: val });
});

export const loaded = async function() {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.sync.get(['activeId', 'currentId', 'projects'], function(res) {
				if (res.projects) {
					projects.set(res.projects);
					activeId.set(res.activeId);
					currentId.set(res.currentId ?? 0);
				} else {
					let groupId = 0;
					let projectId = groupId + 1;

					projects.set([{
						id: groupId,
						title: "Default",
						items: [{
							id: projectId,
							title: "Default project",
						}],
					}]);

					currentId.set(projectId + 1);
					activeId.set(projectId);
				}
				resolve(true);
			});
		} catch (ex) {
			console.error(ex);
			reject(false);
		}
	});
};

