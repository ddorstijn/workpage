import { Component, JSXElement } from "solid-js";

import "./Options.css";

interface Props {
    children: JSXElement

    edit: () => void
    remove: () => void
};

export const Options: Component<Props> = (props) => {
    return (
        <div class="options-container">
            {props.children}
            <div class="options">
                <button class="clear edit" onClick={props.edit}>
                    <i class="ph-fill ph-pen"></i>
                </button>
                <button class="clear delete" onClick={props.remove}>
                    <i class="ph-fill ph-trash-simple"></i>
                </button>
            </div>
        </div>
    );
}