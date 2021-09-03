<script>
  import Checkbox from "../Checkbox.svelte";

  export let task;

  function pretty_date(date) {
    return new Intl.DateTimeFormat('en', { day: "numeric", month: 'long' }).format(date);
  }
</script>

<li>
  <Checkbox bind:checked={task.done} />
  <div class="text">
    <div class="title">{task.title}</div>
    <small class="text-grey"><span class="material-icons">event</span>{pretty_date(task.due)}</small>
  </div>
</li>

<style>
  li {
    margin-bottom: 2rem;

    display: flex;
    align-items: center;
    gap: 1.5rem;

    line-height: 1.3;
  }

  .title {
    font-weight: 500;
  }

  small {
    font-size: 1.2rem;
    font-weight: 300;

    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  small .material-icons {
    font-size: 1.2rem;
  }
</style>