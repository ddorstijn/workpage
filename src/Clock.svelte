<script>
  import { onMount } from 'svelte';

  let date = "date";
  let time = "time";

  function update() {
    const d = new Date()
    date = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d)

    time = new Intl.DateTimeFormat('en-GB',  {
      hour: 'numeric',
      minute: 'numeric',
    }).format(d)

    setTimeout(() => {
      update()
    }, 5000);
  };

  onMount(() => {
    update();
  });
</script>

<article class="flex flex-col items-center justify-center">
  <h1 class="text-7xl">{time}</h1>
  <p class="text-2xl">{date}</p>
</article>
