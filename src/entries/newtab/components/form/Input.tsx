import { TextField } from "@kobalte/core"
import { Accessor, Component, onMount } from "solid-js"

interface Props {
    label: string,
    placeholder: string,
    error?: Accessor<string>,
}

const Input: Component<Props> = (props) => {
    let ref: HTMLInputElement | undefined;
    onMount(() => {
        setTimeout(() => ref?.focus(), 0)
    });

    return (
        <TextField.Root name="project" validationState={props.error() || '' != '' ? 'invalid' : 'valid'}>
            <TextField.Label class="block py-1">{props.label}</TextField.Label>
            <TextField.Input ref={ref} class="py-1 px-2 rounded bg-orange-1 invalid:outline-red outline-1 outline-solid" placeholder={props.placeholder} />
            <TextField.ErrorMessage class="text-red">{props.error()}</TextField.ErrorMessage>
        </TextField.Root>
    )
} 

export default Input;
