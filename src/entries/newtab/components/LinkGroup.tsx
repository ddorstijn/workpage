import { Component, For } from "solid-js";

import LinkItem from "./LinkItem";

interface Group {
  title: string,
  color: string,
  links: Array<{
    alias: string
    url: URL,
  }>
};

const LinkGroup: Component<Group> = (props) => {
  return (
    <li>
      <header>
        <h2 class="text-2xl font-600 py-1.5" style={{'color': props.color}}>{props.title}</h2>
        <div class="h-1 w-16" style={{'background-color':  props.color}}></div>
      </header>
      <ul class="mt-4">
        <For each={props.links}>{(link) => <LinkItem alias={link.alias} url={link.url} />}</For>
      </ul>
    </li>
  )
}

export default LinkGroup;