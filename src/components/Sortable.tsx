import { DragDropProvider, DragDropSensors, DragEventHandler, SortableProvider, closestCenter, createSortable } from "@thisbeyond/solid-dnd";
import { Component, For, JSXElement, createEffect, createSignal } from "solid-js";


declare module "solid-js" {
  namespace JSX {
    interface DirectiveFunctions {
      sortable: ReturnType<typeof createSortable>;
    }
  }
}


interface ListProps<T> {
  list: Array<T>,
  component: Component<{item: T}>,
  callback: (val: Array<T>) => void
}

export function SortableList<T>(props: ListProps<T>): JSXElement {
  let [items, setItems] = createSignal<[string, T][]>([]);

  createEffect(() => {
    setItems(props.list.map(t => { 
      return [crypto.randomUUID(), t ] as [string, T];
    }));
  });
  
  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = items().map(([id]) => id);
      const fromIndex = currentItems.findIndex(id => id == draggable.id);
      const toIndex = currentItems.findIndex(id => id == droppable.id);
      if (fromIndex !== toIndex) {
        const updatedItems = items().slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));

        setItems(updatedItems);
        props.callback(items().map(([_, i]) => i));
      }
    }
  }
  
  return (
    <DragDropProvider onDragEnd={onDragEnd} collisionDetector={closestCenter}>
      <DragDropSensors />
      <ol>
        <SortableProvider ids={items().map(([id]) => id)}>
          <For each={items()}>
            { ([id, task]) => <SortableItem id={id} item={task} component={props.component} /> }
          </For>
        </SortableProvider>
      </ol>
    </DragDropProvider>
  )
}

type ItemProps<T> = {
  id: string,
  item: T,
  component: Component<{item: T}>
}

export function SortableItem<T>(props: ItemProps<T>): JSXElement {
  // @ts-ignore
  const sortable = createSortable(props.id);
  
  return (
    <li use:sortable>
      <props.component item={props.item} />
    </li>
  )
}