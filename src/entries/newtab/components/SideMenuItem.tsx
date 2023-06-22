import { Component, JSX, Show, createMemo, createUniqueId } from "solid-js";
import * as tooltip from "@zag-js/tooltip"
import { normalizeProps, useMachine } from "@zag-js/solid"

const SideMenuItem: Component<{ children: JSX.Element, tooltip: string }> = (props) => {
  const [state, send] = useMachine(tooltip.machine({ id: createUniqueId() }))

  const api = createMemo(() => tooltip.connect(state, send, normalizeProps))

  return (
    <div>
      <button {...api().triggerProps}>{props.children}</button>
      <Show when={api().isOpen}>
        <div {...api().positionerProps}>
          <div {...api().contentProps}><span class="grid px-2 py-1 place-items-center bg-dark rounded text-light">{props.tooltip}</span></div>
        </div>
      </Show>
    </div>
  )
};

export default SideMenuItem;
