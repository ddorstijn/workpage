import { createSortable } from "@thisbeyond/solid-dnd";
import { Accessor, Component } from "solid-js"
import { Link } from "@kobalte/core";

const LinkItem: Component<{alias: string, url: string, index: Accessor<number>}> = (props) => {
    const sortable = createSortable(props.index());

    return (
        <li use:sortable={sortable} class="flex items-center ml-1.5 mb-1.5">
            <Link.Root draggable="false" class="align-middle" href={props.url}>{props.alias} - {props.index()}</Link.Root>
        </li>
    )
}

export default LinkItem;
