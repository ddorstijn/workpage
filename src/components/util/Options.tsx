import { Component, JSXElement } from "solid-js";

interface Props {
    children: JSXElement
};

export const Options: Component<Props> = (props) => {
    return (
        <section aria-label="Options">
            <h1>Options</h1>
        </section>
    );
}