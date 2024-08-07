import { Component } from "solid-js";

export type Item = { id: string, title: string, completed: boolean };

type Props = {
    item: Item
    toggleCompleted: (id: string) => void
}

export const TaskItem: Component<Props> = (props) => {
    return <li>
        <input
            type="checkbox"
            checked={props.item.completed}
            onChange={[props.toggleCompleted, props.item.id]}
        />
        {props.item.title}
    </li>;
}