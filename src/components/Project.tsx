import { Component, useContext } from "solid-js";

import styles from "./Project.module.css";
import ArrowDownIcon from "~icons/material-symbols/keyboard-arrow-down-rounded"
import { ProjectContext } from "./Context";
import Dialog from "./Dialog";

const Project: Component<{class: string}> = (props) => {  
  let dialog: HTMLDialogElement | undefined;

  const ctx = useContext(ProjectContext);
  
  return (
    <div class={props.class}>
      <button data-rounded class={styles.button} onClick={() => dialog?.showModal()}>
        <span>{ctx?.active()}</span>
        <ArrowDownIcon />
      </button>

      <Dialog name="Choose project" ref={dialog}>
        <ol></ol>
      </Dialog>
    </div>
  )
}

export default Project;