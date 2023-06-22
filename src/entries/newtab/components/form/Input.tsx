import { Accessor, Component, onMount } from "solid-js"

interface Props {
    name: string,
    label: string,
    placeholder: string,
    autofocus: boolean,
    error: Accessor<string>,
}

const Input: Component<Props> = (props) => {
    let ref: HTMLInputElement | undefined;
    onMount(() => {
        if (props.autofocus) {
            setTimeout(() => ref?.focus(), 0)
        }
    });

    return (
        <>
            <label class="block py-1">{props.label}</label>
            <input ref={ref} type="" class="py-1 px-2 rounded bg-orange-1 invalid:outline-red outline-1 outline-solid" placeholder={props.placeholder} />
            <span class="text-red">{props.error()}</span>
        </>
    
    )
} 

export default Input;
