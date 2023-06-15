import { Accessor, Component } from "solid-js"
import { Link } from "@kobalte/core";
import { Link as TLink } from "~/project"

const LinkItem: Component<TLink> = (props) => {
    return (
        <Link.Root role="listitem" class="align-middle block" href={props.url}>{props.name}</Link.Root>
    )
}

export default LinkItem;
