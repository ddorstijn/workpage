import { Component } from "solid-js";
import Dialog from "./Dialog";

import styles from "./Project.module.css";

const Project: Component<{class: string}> = (props) => {  
  let dialog: HTMLDialogElement | undefined;
  
  return (
    <div class={props.class}>
      <button data-rounded class={styles.button} onClick={() => dialog?.showModal()}>
        <span>General</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062Z" />
        </svg>
      </button>

      <Dialog name="Choose project" ref={dialog}>
        <ol></ol>
      </Dialog>
    </div>
  )
}

export default Project;