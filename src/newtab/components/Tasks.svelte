<script>
  import { activeProject } from "../../store.js";
  import Database from "../../database.js";
  import Checkbox from "./Checkbox.svelte";

  const formatter = new Intl.DateTimeFormat('en', { day: "numeric", month: 'long' });

  activeProject.subscribe(val => {
    if (!val) return;
    
    Database.getTasks(val).then(res => tasks = res);
  })

  // -- Members -- \\
  let tasks = [];

  // -- Functions -- \\
  function pretty_date(date) {
    return formatter.format(date);
  }
</script>

<article>
  <header>
    <h1>Tasks</h1>
    <button class="button clear icon-only material-icons">event</button>
  </header>
  <div id="task__stats" class="card" style="display: none;">
    <i class="material-icons">thumb_up</i>
    <div class="text">
      <div class="title">Stats</div>
      <small>You've completed 6 tasks in the past week!</small>
    </div>
  </div>

  <ul id="task__list">
    {#each tasks as task}
      <li>
        <Checkbox bind:checked={task.done} />
        <div class="text">
          <div class="title">{task.title}</div>
          <small class="text-grey">{pretty_date(task.due)}</small>
        </div>
      </li>
    {/each}
  </ul>
</article>

<style>
  article {
    margin: 2rem;
    padding: 2rem;
    box-shadow: none;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--color-lightGrey);
  }

  header * {
    margin: 0;
    padding: 0;
  }

  #task__stats {
    display: flex;
    align-items: center;
    gap: 2rem;
    line-height: 1.2;
  }

  #task__stats .text .title {
    font-weight: bold;
  }

  #task__list {
    padding: 0 1.5rem;
    margin: 0;
    list-style: none;
    
    max-height: 50vh;
    overflow-y: auto;
  }

  #task__list li {
    margin-top: 2rem;

    display: flex;
    align-items: center;
    gap: 1rem;

    line-height: 1.2;
  }

  #task__list li .title {
    font-weight: 500;
  }

  small {
    font-size: 1.2rem;
    font-weight: 300;
  }
</style>
