import { Component } from "solid-js";
import "./ExpandSearch.css";

interface Props {
    filter: (event: Event) => any;
}

export const ExpandSearch: Component<Props> = (props) => {
    return (
        <label class="expand-search">
            <input id="search" type="search" placeholder="Search item" onInput={props.filter} />
            <i class="ph ph-magnifying-glass"></i>
        </label>
    );
}