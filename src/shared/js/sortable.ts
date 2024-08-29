declare global {
    interface Window { dragCtx: { el: HTMLElement, group: string, source: HTMLElement } | undefined; }
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
    el.addEventListener("dragend", () => {
        document.getElementById("ghost")!.remove();
        el.classList.remove("dragging");
    });
}

export function sortable(el: HTMLElement, group: string, getData?: (el: HTMLElement) => { type: string, content: string }, onDrop?: (ctx: typeof window.dragCtx, index: number) => void) {
    el.classList.add("sortable");

    el.addEventListener("dragstart", (e: DragEvent) => {
        e.stopPropagation();

        const item = (e.target as HTMLElement).closest('.draggable')! as HTMLElement;
        item.classList.add("dragging");

        const ghost = document.createElement("li");
        ghost.id = "ghost";
        el.appendChild(ghost);

        window.dragCtx = { el: item, group, source: el };

        if (getData) {
            const data = getData(item);
            e.dataTransfer?.setData(data.type, data.content);
        }
    })

    el.addEventListener("dragover", (e: DragEvent) => {
        if (!window.dragCtx || window.dragCtx.group !== group) { return; }

        e.preventDefault();

        const afterElement = getDragAfterElement(el, e.clientY);
        if (afterElement == null) {
            el.appendChild(document.getElementById("ghost")!);
        } else {
            el.insertBefore(document.getElementById("ghost")!, afterElement);
        }
    });

    el.addEventListener("drop", (e: DragEvent) => {
        const afterElement = getDragAfterElement(el, e.clientY);
        const children = Array.from(el.children).filter((el) => el !== window.dragCtx?.el);
        const index = afterElement ? children.indexOf(afterElement) : children.length;

        onDrop?.(window.dragCtx!, index - 1);
        window.dragCtx = undefined;
    });
}

function getDragAfterElement(container: HTMLElement, y: number) {
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null as HTMLElement | null };

    for (const child of container.querySelectorAll<HTMLElement>(".draggable:not(.dragging)")) {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            closest = { offset, element: child };
        }
    }

    return closest.element;
};