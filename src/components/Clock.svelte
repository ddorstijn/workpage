<script>
  import { onDestroy } from "svelte";
  import { locale } from "svelte-i18n";

  // -- Members -- \\
  let date;
  let time;

  let timeout = setInterval(update, 5000);
  onDestroy(() => clearInterval(timeout));
  locale.subscribe(() => update());

  // -- Functions -- \\
  async function update() {
    let format = $locale + "-GB";
    const d = new Date();

    let temp = new Intl.DateTimeFormat(format, {
      month: "short",
      day: "numeric",
      weekday: "long",
    }).format(d);
    date = temp[0].toUpperCase() + temp.slice(1);

    time = new Intl.DateTimeFormat(format, {
      hour: "numeric",
      minute: "numeric",
    }).format(d);
  }
</script>

<article class="text-center">
  <h1 class="text-dark">{time}</h1>
  <p class="text-grey">{date}</p>
</article>

<style>
  h1 {
    margin: 0;
    line-height: 1em;
    font-weight: bold;
    font-size: 6.4rem;
  }
</style>
