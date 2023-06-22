import { Component } from "solid-js"
import { Link as TLink } from "~/project"

const LinkItem: Component<TLink> = (props) => {
    return (
        <a role="listitem" class="align-middle block" href={props.url}>{props.name}</a>
    )
}

export default LinkItem;
