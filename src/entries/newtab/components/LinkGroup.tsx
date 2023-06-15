import { Component, For } from "solid-js";
import {dndzone as dndzoneDirective } from "solid-dnd-directive";
import { Link } from "~/project";
import LinkItem from "./LinkItem";

interface Props {
  name: string,
  color: string,
  links: Link[],
  onItemsChange: (e: any, finalize: boolean) => any,
};

const LinkGroup: Component<Props> = (props) => {
  // @ts-ignore
  const dndzone = dndzoneDirective;

  return (
    <li>
      <header>
        <h2 class="text-2xl font-600 py-1.5" style={{'color': props.color}}>{props.name}</h2>
        <div class="h-1 w-16" style={{'background-color':  props.color}}></div>
      </header>
      
      <div 
        role="list" 
        use:dndzone={{ items: () => props.links, zoneTabIndex: -1 }} 
        on:consider={(e: any) => props.onItemsChange(e, false)}
        on:finalize={(e: any) => props.onItemsChange(e, true)}
        class="mt-4"
      >
        <For each={props.links} fallback={<span class="text-gray">No links yet...</span>}>
          {(link) => (
            <LinkItem id={link.id} name={link.name} url={link.url} />
          )}
        </For>
      </div>
    </li>
  )
}

export default LinkGroup;
