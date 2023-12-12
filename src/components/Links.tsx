import { Component, For, useContext } from "solid-js";
import { ProjectContext } from "./Context";

const Links: Component<{class: string}> = (props) => {
  let ctx = useContext(ProjectContext);
  console.log(ctx?.project.linkgroups);

  return (
    <ol {...props}>
      <For each={ctx?.project.linkgroups}>
        { (item) => <LinkGroup group={item} /> }
      </For>
    </ol>
  )
}

export default Links;

const LinkGroup: Component<{ group: LinkGroup }> = (props) => {
  return (
    <li>
      <div>
        <header>
          <h2>{props.group.name}</h2>
        </header>
        <ol>
        </ol>
      </div>
    </li>
  )
}