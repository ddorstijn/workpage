import { Component, createSignal, onMount } from "solid-js";

import "./Clock.css";

export const Clock: Component = () => {
    let [time, setTime] = createSignal("00:00");
    let [date, setDate] = createSignal("00/00/0000");

    const update = () => {
        let now = new Date();
        setTime(now.toLocaleTimeString('en-gb', { hour: '2-digit', minute: '2-digit' }));
        setDate(now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
    }

    onMount(() => {
        update();
        setInterval(update, 5000);
    });

    return (
        <section aria-label="Clock" id="clock">
            <h1 class="clock__time"><time class="time" dateTime={time()}>{time()}</time></h1>
            <p class="clock__date"><time class="date" dateTime={date()}>{date()}</time></p>
        </section>
    );
}