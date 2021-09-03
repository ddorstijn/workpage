<script>
  import { activeModal, activeProject } from "../../../store.js";
  	
	export let project;
  	
	function setActive(project) {
    $activeProject = project.name;
    $activeModal = null;
  }

  function daysDifference(date) {
    const diff = new Date().setHours(12) - new Date(+date).setHours(12);
    const diffDays = Math.round(diff / 8.64e7);
    if (diffDays == 0) {
      return "Today";
    }

    return `${diffDays} days ago`;
  }
</script>

<li on:click={setActive(project)}>
  <span>w</span>
  <div class="text">
    <div class="title">{project.name}</div>
    <small class="text-grey"><span class="material-icons">history</span>{daysDifference(project.last_used)}</small>
  </div>
</li>

<style>
	li {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    line-height: 1.3;
    cursor: pointer;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
  }

  li:hover {
    background-color: var(--color-lightGrey);
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