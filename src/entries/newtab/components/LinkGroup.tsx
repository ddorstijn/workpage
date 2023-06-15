import { Accessor, Component, For, createSignal } from "solid-js";
import {
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  DragOverlay,
  SortableProvider,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { SetStoreFunction } from "solid-js/store";
import { Link, Project } from "~/project";
import LinkItem from "./LinkItem";

interface Props {
  title: string,
  color: string,
  links: { alias: string, url: string }[],
  index: Accessor<number>,
  setLinks: SetStoreFunction<Project>,
};

function disableAnchor(ev: MouseEvent) {
  ev.preventDefault();
}

const LinkGroup: Component<Props> = (props) => {
  const [activeItem, setActiveItem] = createSignal<number | null>(null);
  const onDragStart: DragEventHandler = ({ draggable }) => {
    draggable.node.querySelector('a')?.addEventListener("click", disableAnchor);
    setActiveItem(draggable.id as number);
  };

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      if (draggable.id !== droppable.id) {
        let dragId = draggable.id as number;
        let dropId = droppable.id as number;
        console.log(dragId, dropId)

        let items = props.links.slice();
        items.splice(dropId, 0, items.splice(dragId, 1)[0]);
        props.setLinks('linksgroups', props.index(), 'links', items);
      }
    }

    setTimeout(() => draggable.node.querySelector('a')?.removeEventListener("click", disableAnchor), 50)
  };

  return (
    <li>
      <header>
        <h2 class="text-2xl font-600 py-1.5" style={{'color': props.color}}>{props.title}</h2>
        <div class="h-1 w-16" style={{'background-color':  props.color}}></div>
      </header>
      <DragDropProvider onDragStart={onDragStart} onDragEnd={onDragEnd} collisionDetector={closestCenter}>
        <DragDropSensors />
        <ul class="mt-4">
          <SortableProvider ids={props.links.map((_, i) => { console.log('Ids changed'); return i })}>
            <For each={props.links}>
              {(link, index) => (
                <LinkItem alias={link.alias} url={link.url} index={index} />
              )}
            </For>
          </SortableProvider>
        </ul>
      <DragOverlay>
        <div class="sortable">{activeItem()}</div>
      </DragOverlay>
      </DragDropProvider>
    </li>
  )
}

export default LinkGroup;
