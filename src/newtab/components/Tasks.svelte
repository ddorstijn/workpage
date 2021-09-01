<script>
  import { activeProject } from "../../store.js";
  import Database from "../../database.js";

  const formatter = new Intl.DateTimeFormat('en', { day: "numeric", month: 'long' });

  activeProject.subscribe(val => {
    if (!val) return;
    
    Database.getTasks(val).then(res => tasks = res);
  })

  // -- Members -- \\
  let viewDone = false;
  let tasks = [];

  // -- Functions -- \\
  async function addTodo() {}

  async function markDone(item) {}

  async function removeTodo(item) {}

  async function removeDone(item) {}

  function pretty_date(date) {
    return formatter.format(date);
  }
</script>

<article class="card">
  <header>
    <h2>Tasks</h2>
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
        <input type="checkbox" />
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
    margin: 4rem;
    box-shadow: none;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    padding: 0;
    margin: 0;
    list-style: none;
    
    max-height: 50vh;
    overflow-y: auto;
  }

  #task__list li {
    margin-top: 1.5rem;

    display: flex;
    align-items: center;
    gap: 1rem;

    line-height: 1.2;
  }

  #task__list li .title {
    font-weight: 500;
  }

  small {
    font-size: 12;
    font-weight: 300;
  }
</style>
