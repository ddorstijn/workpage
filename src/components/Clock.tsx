import { createSignal } from "solid-js";
import styles from "./Clock.module.css";

export default function Clock() {
  const [time, setTime] = createSignal("");
  const [date, setDate] = createSignal("");

  const update = () => {
    let now = new Date();
    setTime(now.toLocaleTimeString(undefined, { hourCycle: "h24", hour: '2-digit', minute: '2-digit' }));
    setDate(now.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }));
  }

  update();
  setInterval(() => update(), 5000);

  return (
    <>
      <h1 class={styles.clock_time}>
        <time class="time" dateTime={time()}>{time()}</time>
      </h1>
      <p class={styles.clock_date}>
        <time class="date" dateTime={date()}>{date()}</time>
      </p>
    </>
  );
}
