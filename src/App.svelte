<script lang="ts">
  import Fab from "./lib/Fab.svelte";
  import Modal from "./lib/modals/Modal.svelte";
  
  import { onMount } from "svelte";
import Clock from "./lib/Clock.svelte";
import Projects from "./lib/Projects.svelte";
import Links from "./lib/Links.svelte";
import Tasks from "./lib/Tasks.svelte";

  let darkmode: boolean;

  onMount(async () => {
    darkmode = JSON.parse(localStorage.getItem("darkmode")) ?? false;
    document.querySelector("body").classList.toggle('dark', darkmode);
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
    <Clock />
    <Projects />
    <Links />
  </main>
  <aside>
    <Tasks />
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
