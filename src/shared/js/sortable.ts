declare global {
  interface Window {
    dragCtx:
      | { list: HTMLElement; item: HTMLElement; group: string }
      | undefined;
  }
}

import "./sortable.css";

interface DraggableOptions {
  el: HTMLElement;
  handle?: string;
}

export function draggable({ el, handle }: DraggableOptions) {
  if (handle) {
    const handleEl = (el.querySelector(handle) as HTMLElement) ?? undefined;

    handleEl.addEventListener("mousedown", () => {
      el.draggable = true;
    });

    el.addEventListener("dragend", () => {
      el.draggable = false;
    });
  } else {
    el.draggable = true;
  }

  el.classList.add("draggable");
  el.addEventListener("dragend", (e) => {
    e.stopPropagation();

    setTimeout(() => {
      el.classList.remove("dragging");
      document.getElementById("ghost")?.remove();
      window.dragCtx = undefined;
    }, 50);
  });
}

interface SortableOptions {
  el: HTMLElement;
  group: string;
  mode: "horizontal" | "vertical";
  onDrop?: (ctx: typeof window.dragCtx, index: number) => any;
}
export function sortable({ el, group, mode, onDrop }: SortableOptions) {
  el.classList.add("sortable");

  el.addEventListener("dragstart", (e: DragEvent) => {
    e.stopPropagation();

    const item = (e.target as HTMLElement).closest(
      ".draggable"
    )! as HTMLElement;
    window.dragCtx = { item, group, list: el };

    const ghost = item.cloneNode(true) as HTMLElement;
    ghost.id = "ghost";
    el.appendChild(ghost);

    item.classList.add("dragging");
  });

  el.addEventListener("dragover", (e: DragEvent) => {
    if (!window.dragCtx || window.dragCtx.group !== group) {
      return;
    }
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

    const children = [
      ...el.querySelectorAll<HTMLElement>("& > .draggable:not(.dragging)"),
    ];
    const index = children.indexOf(document.getElementById("ghost")!);

    document.getElementById("ghost")!.remove();
    window.dragCtx!.item.classList.remove("dragging");

    await onDrop?.(window.dragCtx!, index);
    window.dragCtx = undefined;
  });
}

function getDragAfterElement(
  container: HTMLElement,
  event: DragEvent,
  mode: "horizontal" | "vertical"
) {
  const children = container.children;
  let closest = Number.NEGATIVE_INFINITY;
  let closestElement: HTMLElement | null = null;

  for (let i = 0; i < children.length; i++) {
    const child = children[i] as HTMLElement;
    if (child.classList.contains("draggable") && child.id !== "ghost") {
      const box = child.getBoundingClientRect();
      const relativeOffset =
        mode === "horizontal"
          ? event.clientX - box.left - box.width / 2
          : event.clientY - box.top - box.height / 2;

      if (relativeOffset < 0 && relativeOffset > closest) {
        closest = relativeOffset;
        closestElement = child;
      }
    }
  }

  return closestElement;
}
