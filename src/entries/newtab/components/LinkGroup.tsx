import { Accessor, Component, For } from "solid-js";
import {
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  SortableProvider,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { SetStoreFunction } from "solid-js/store";
import { Project } from "~/project";
import LinkItem from "./LinkItem";

interface Group {
  title: string,
  color: string,
  links: { alias: string, url: string }[],
  index: Accessor<number>,
  setLinks: SetStoreFunction<Project>,
};

const LinkGroup: Component<Group> = (props) => {
  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      if (draggable.id !== droppable.id) {
        let dragId = draggable.id as number;
        let dropId = droppable.id as number;

        let drag = props.links.at(dragId)!;
        let drop = props.links.at(dropId)!;

        let items = props.links.slice();
        items[dropId] = drag;
        items[dragId] = drop;

        console.log(items)
        props.setLinks('linksgroups', props.index(), 'links', items);
      }
    }
  };

  return (
    <li>
      <header>
        <h2 class="text-2xl font-600 py-1.5" style={{'color': props.color}}>{props.title}</h2>
        <div class="h-1 w-16" style={{'background-color':  props.color}}></div>
      </header>
      <DragDropProvider onDragEnd={onDragEnd} collisionDetector={closestCenter}>
        <DragDropSensors />
        <ul class="mt-4">
          <SortableProvider ids={props.links.map((_, i) => i)}>
            <For each={props.links}>
              {(link, index) => (
                <LinkItem alias={link.alias} url={link.url} index={index} />
              )}
            </For>
          </SortableProvider>
        </ul>
      </DragDropProvider>
    </li>
  )
}

export default LinkGroup;
