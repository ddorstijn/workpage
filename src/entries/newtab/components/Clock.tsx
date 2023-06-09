import { Component } from "solid-js";
import { createDateNow } from "@solid-primitives/date";

const Clock: Component = () => {
    // updates every second:
    const [now] = createDateNow(1000);

    return (
        <div class="text-center">
            <h1 class="text-6xl font-bold py-1">{now().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</h1>
            <span>{now().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric'})}</span>
        </div>
    )
}

export default Clock;