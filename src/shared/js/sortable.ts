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
  const handleEl = handle
    ? (el.querySelector(handle) as HTMLElement)
    : undefined;

  if (handleEl) {
    handleEl.addEventListener("mousedown", () => {
      el.draggable = true;
    });

    el.addEventListener("dragend", () => {
      el.draggable = false;
    });
  } else {
    el.draggable = true;
  }

  el.addEventListener("drag", (ev) => {
    ev.stopPropagation();
    el.style.display = "none";
  });

  el.classList.add("draggable");
  el.addEventListener("dragend", (ev) => {
    ev.stopPropagation();
    setTimeout(() => {
      el.style.display = "";
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
  onDrop?: (index: number) => any;
}

export function sortable({ el, group, mode, onDrop }: SortableOptions) {
  el.classList.add("sortable");

  el.addEventListener("dragstart", (e: DragEvent) => {
    e.stopPropagation();

    const item = (e.target as HTMLElement).closest(".draggable") as HTMLElement;
    window.dragCtx = { item, group, list: el };

    const ghost = item.cloneNode(true) as HTMLElement;
    ghost.id = "ghost";
    el.appendChild(ghost);

    item.classList.add("dragging");
  });

  el.addEventListener("dragover", (e: DragEvent) => {
    if (!window.dragCtx || window.dragCtx.group !== group) return;

    e.preventDefault();

    const afterElement = getDragAfterElement(el, e, mode);
    const ghost = document.getElementById("ghost")!;
    if (afterElement == null) {
      el.appendChild(ghost);
    } else {
      el.insertBefore(ghost, afterElement);
    }
  });

  el.addEventListener("drop", async (ev: DragEvent) => {
    ev.stopPropagation();

    const children = Array.from(
      el.querySelectorAll<HTMLElement>("& > .draggable:not(.dragging)")
    );
    const index = children.indexOf(document.getElementById("ghost")!);

    document.getElementById("ghost")!.remove();
    window.dragCtx!.item.classList.remove("dragging");

    await onDrop?.(index);
    window.dragCtx = undefined;
  });
}

function getDragAfterElement(
  container: HTMLElement,
  ev: DragEvent,
  mode: "horizontal" | "vertical"
): HTMLElement | null {
  let closestElement: HTMLElement | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < container.children.length; i++) {
    const child = container.children[i] as HTMLElement;

    if (
      !child.classList.contains("draggable") &&
      child.classList.contains("dragging") &&
      child.id === "ghost"
    ) {
      continue;
    }

    const box = child.getBoundingClientRect();
    let offset: number;
    if (mode === "horizontal") {
      if (ev.clientY < box.top || ev.clientY > box.bottom) continue;
      offset = ev.clientX - (box.left + box.width / 2);
    } else {
      if (ev.clientX < box.left || ev.clientX > box.right) continue;
      offset = ev.clientY - (box.top + box.height / 2);
    }

    if (Math.abs(offset) < Math.abs(closestDistance)) {
      closestDistance = offset;
      closestElement = child;
    }
  }

  return closestElement && closestDistance > 0
    ? (closestElement.nextElementSibling as HTMLElement)
    : closestElement;
}
