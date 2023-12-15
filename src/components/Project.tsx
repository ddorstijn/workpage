import { Component, For, createSignal, useContext } from "solid-js";

import styles from "./Project.module.css";
import ArrowDownIcon from "~icons/material-symbols/keyboard-arrow-down-rounded"
import { ProjectContext } from "./Context";
import Dialog from "./Dialog";
import { storage } from "webextension-polyfill";

const Project: Component<{ class: string }> = (props) => {
  let dialog: HTMLDialogElement | undefined;

  const ctx = useContext(ProjectContext)!;
  let [projects, setProjects] = createSignal<{ name: string, used: Date }[]>([]);
  
  async function open() {
    storage.sync.get().then(records => {
      setProjects(Object.entries(records).map(([name, { used }]) => ({ name, used })));
    });
    
    dialog?.showModal();
  }

  function selectProject(project: string) {
    ctx.setActive(project);
    dialog?.close();
  }

  return (
    <div class={props.class}>
      <button data-rounded class={styles.button} onClick={open}>
        <span>{ctx.active()}</span>
        <ArrowDownIcon />
      </button>

      <Dialog name="Choose project" ref={dialog}>
        <ol>
          <For each={projects()}>
            {(project) => <li onClick={() => selectProject(project.name)}>{project.name}</li>}
          </For>
        </ol>
      </Dialog>
    </div>
  )
}

export default Project;