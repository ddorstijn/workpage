import { Component, JSXElement, Ref } from "solid-js";
import styles from "./Dialog.module.css"
import CloseIcon from '~icons/material-symbols/close-rounded'

const Dialog: Component<{ name: string, children: JSXElement, ref: Ref<HTMLDialogElement | undefined>}> = (props) => {  
  return (
    <dialog class={styles.dialog} ref={props.ref}>
      <header>
        <h2>{props.name}</h2>
        <button onClick={ev => ev.target.closest('dialog')!.close()}>
          <CloseIcon />
        </button>
      </header>
      {props.children}
    </dialog>
  )
}

export default Dialog;