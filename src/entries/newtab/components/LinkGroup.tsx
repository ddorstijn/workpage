import { Accessor, Component, For } from "solid-js";
import {dndzone, SolidOptions } from "solid-dnd-directive";
import { Link } from "~/project";
import LinkItem from "./LinkItem";

interface Props {
  name: string,
  color: string,
  links: Link[],
  onItemsChange: (e: any) => any,
};

const LinkGroup: Component<Props> = (props) => {
  return (
    <li>
      <header>
        <h2 class="text-2xl font-600 py-1.5" style={{'color': props.color}}>{props.name}</h2>
        <div class="h-1 w-16" style={{'background-color':  props.color}}></div>
      </header>
      
      <ul class="mt-4">
        <For each={props.links}>
          {(link, index) => (
            <LinkItem alias={link.name} url={link.url} index={index} />
          )}
        </For>
      </ul>
    </li>
  )
}

export default LinkGroup;
