import { Accessor, Component } from "solid-js"
import { Link } from "@kobalte/core";

const LinkItem: Component<{alias: string, url: string, index: Accessor<number>}> = (props) => {
    return (
        <li class="flex items-center ml-1.5 mb-1.5">
            <Link.Root draggable="false" class="align-middle" href={props.url}>{props.alias} - {props.index()}</Link.Root>
        </li>
    )
}

export default LinkItem;
