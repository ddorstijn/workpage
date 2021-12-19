<script lang="ts">
  import Fab from "./lib/Fab.svelte";
  import Modal from "./lib/modals/Modal.svelte";
  
  import { onMount } from "svelte";
  import Database from "./database/LoveField";

  let darkmode: boolean;

  onMount(async () => {
    darkmode = JSON.parse(localStorage.getItem("darkmode")) ?? false;
    document.querySelector("body").classList.toggle('dark', darkmode);
    
    const db = await Database.init();
    console.log(await db.projects.get());
    let project = await db.projects.add({name: "new Project"}); 
    console.log(await db.projects.get());
    project.name = "Updated project";
    await db.projects.update(project);
    console.log(await db.projects.get());
  })

  function toggleTheme() {
    darkmode = !darkmode;
    document.querySelector("body").classList.toggle('dark', darkmode);
    localStorage.setItem("darkmode", darkmode.toString());
  }
</script>

<ul id="settings">
  <li>
    <button id="theme-toggle" class="button icon" on:click={toggleTheme}>
      <i class="material-icons">
        {#if darkmode} light_mode {:else} dark_mode {/if}
      </i>
    </button>
  </li>
</ul>

<article class="newtab">
  <main>
    {#await import("./lib/Clock.svelte") then c}
      <svelte:component this={c.default} />
    {/await}
    {#await import("./lib/Projects.svelte") then c}
      <svelte:component this={c.default} />
    {/await}
    {#await import("./lib/Links.svelte") then c}
      <svelte:component this={c.default} />
    {/await}
  </main>
  <aside>
    {#await import("./lib/Tasks.svelte") then c}
      <svelte:component this={c.default} />
    {/await}
  </aside>
</article>

<Fab />
<Modal />

<style>
article.newtab {
	height: 100vh;
	width: 100vw;

	display: flex;
	background-color: var(--bg-secondary-color);
}

#settings {
  position: absolute;
  padding: 0;
  left: 0;
  top: 0;

  list-style: none;
}

#settings button {
  background-color: transparent;
}

main {
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

aside {
  width: 25vw;
}
</style>
