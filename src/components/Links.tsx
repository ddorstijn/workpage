import { Component, For, useContext } from "solid-js";
import { ProjectContext } from "./Context";
import styles from "./Links.module.css";

const Links: Component<{class: string}> = (props) => {
  let ctx = useContext(ProjectContext);

  return (
    <div classList={{[styles.wrapper]: true, [props.class]: true}}>
      <ol class={styles["group-list"]}>
        <For each={ctx?.project.linkgroups}>
          { (item) => <LinkGroup group={item} /> }
        </For>
      </ol>
    </div>
  )
}

export default Links;

const LinkGroup: Component<{ group: LinkGroup }> = (props) => {
  return (
    <li class={styles.linkgroup} data-color={props.group.color}>
      <section>
        <header>
          <h2>{props.group.name}</h2>
        </header>
        <ol>
          <For each={props.group.links}>
            { (item) => <Link link={item} /> }
          </For>
        </ol>
      </section>
    </li>
  )
}

const Link: Component<{ link: Link }> = (props) => {
  return (
    <li class={styles.link}>
      <a draggable="false" href={props.link.url.toString()}>{props.link.name}</a>
    </li>
  )
}