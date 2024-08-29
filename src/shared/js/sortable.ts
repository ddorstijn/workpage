declare global {
    interface Window { dragCtx: { list: HTMLElement, item: HTMLElement, group: string } | undefined; }
}

import "./sortable.css";

export function draggable(el: HTMLElement, handle?: HTMLElement | string) {
    if (handle) {
        const handleEl: HTMLElement | undefined = typeof handle === "string" ? el.querySelector(handle) as HTMLElement ?? undefined : handle
        handleEl.addEventListener("mousedown", () => {
            el.draggable = true
        });

        el.addEventListener("dragend", () => {
            el.draggable = false
        });
    } else {
        el.draggable = true;
    }

    el.classList.add("draggable");
    el.addEventListener("dragend", (e) => {
        e.stopPropagation();

        document.getElementById("ghost")!.remove();
        el.classList.remove("dragging");
    });
}

export function sortable(el: HTMLElement, group: string, mode: "horizontal" | "vertical", getData?: (el: HTMLElement) => { type: string, content: string }, onDrop?: (ctx: typeof window.dragCtx, index: number) => any) {
    el.classList.add("sortable");

    el.addEventListener("dragstart", (e: DragEvent) => {
        e.stopPropagation();

        const item = (e.target as HTMLElement).closest('.draggable')! as HTMLElement;
        item.classList.add("dragging");

        const ghost = document.createElement("li");
        ghost.id = "ghost";
        el.appendChild(ghost);

        window.dragCtx = { item: item, group, list: el };

        console.log(window.dragCtx);

        if (getData) {
            const data = getData(item);
            e.dataTransfer?.setData(data.type, data.content);
        }
    })

    el.addEventListener("dragover", (e: DragEvent) => {
        e.stopPropagation();

        if (!window.dragCtx || window.dragCtx.group !== group) { return; }

        e.preventDefault();

        const afterElement = getDragAfterElement(el, e, mode);
        if (afterElement == null) {
            el.appendChild(document.getElementById("ghost")!);
        } else {
            el.insertBefore(document.getElementById("ghost")!, afterElement);
        }
    });

    el.addEventListener("drop", async (e: DragEvent) => {
        e.stopPropagation();

        const afterElement = getDragAfterElement(el, e, mode);
        const children = Array.from(el.children).filter((el) => el !== document.getElementById("ghost")!);
        const index = afterElement ? children.indexOf(afterElement) : children.length - 1;

        await onDrop?.(window.dragCtx!, index);
        window.dragCtx = undefined;
    });
}

function getDragAfterElement(container: HTMLElement, event: DragEvent, mode: "horizontal" | "vertical") {
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null as HTMLElement | null };

    for (const child of container.querySelectorAll<HTMLElement>(":not(#ghost)")) {
        const box = child.getBoundingClientRect();

        const relativeOffset = mode === "horizontal" ? event.clientX - box.left - box.width / 2 : event.clientY - box.top - box.height / 2;

        if (relativeOffset < 0 && relativeOffset > closest.offset) {
            closest = { offset: mode === "horizontal" ? event.clientX : event.clientY, element: child };
        }
    }

    return closest.element;
};
