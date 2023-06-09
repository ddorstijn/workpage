import { Component } from "solid-js"

const LinkItem: Component<{alias: string, url: URL}> = (props) => {
    return (
        <li class="flex items-center group ml-1.5 mb-1.5">
            <a class="align-middle" href={props.url.href}>{props.alias}</a>
        </li>
    )
}

export default LinkItem;