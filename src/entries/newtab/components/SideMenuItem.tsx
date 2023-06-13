import { Component, JSX } from "solid-js";
import { Tooltip } from "@kobalte/core";

const SideMenuItem: Component<{ children: JSX.Element, tooltip: string }> = (props) => {
  return (
    <Tooltip.Root placement="right" openDelay={5} closeDelay={5}>
      <Tooltip.Trigger>{props.children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>
          <span class="grid px-2 py-1 place-items-center bg-dark rounded text-light">{props.tooltip}</span>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
};

export default SideMenuItem;
