import { Component, JSX, createUniqueId } from "solid-js";
import * as dialog from "@zag-js/dialog"
import { Portal } from "solid-js/web";
import { normalizeProps, useMachine } from "@zag-js/solid";

interface Props {
  title: string,
  icon: string,
  children: JSX.Element
}

const Modal: Component<Props> = (props) => {
  const [state, send] = useMachine(dialog.machine({ id: createUniqueId() }))

  const api = dialog.connect(state, send, normalizeProps)
  
  return (
    <>
      <button {...api.triggerProps}><span class={"hover:text-gray-900 " + props.icon}></span></button>
      {api.isOpen && (
        <Portal>
          <div {...api.backdropProps} />
          <div {...api.containerProps}>
            <div {...api.contentProps}>
              <h2 {...api.titleProps}>{props.title}</h2>
              <p {...api.descriptionProps}>
                {props.children}
              </p>
              
              <button {...api.closeTriggerProps}>Close</button>
            </div>
          </div>
        </Portal>
      )}
    </>
  )
}

export default Modal;
