<script>
  import { loaded } from "../store.js";
	import Fab from "./components/Fab.svelte";
  import Modal from "./components/modals/Modal.svelte";

  let theme = localStorage.getItem("theme") ?? "light";
  document.querySelector("body").classList += theme;

  function toggleTheme() {
    if (theme == "dark") {
      theme = "light";
    } else {
      theme = "dark";
    }

    document.querySelector("body").classList = theme;
    localStorage.setItem("theme", theme);
  }
</script>

<ul id="settings">
  <li>
    <button id="theme-toggle" class="button icon" on:click={toggleTheme}>
      <i class=" material-icons"
        >{#if theme == "dark"} light_mode {:else} dark_mode {/if}</i
      >
    </button>
  </li>
</ul>

{#await loaded()}
  Loading...
{:then}
  <article class="newtab">
    <main>
      {#await import("./components/Clock.svelte") then c}
        <svelte:component this={c.default} />
      {/await}
      {#await import("./components/Projects.svelte") then c}
        <svelte:component this={c.default} />
      {/await}
      {#await import("./components/Links.svelte") then c}
        <svelte:component this={c.default} />
      {/await}
    </main>
    <aside>
      {#await import("./components/Tasks.svelte") then c}
        <svelte:component this={c.default} />
      {/await}
    </aside>
  </article>
{/await}

<div class="fab-wrapper">
  <Fab />
</div>
<Modal />

<style>
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

  .fab-wrapper {
    position: fixed;
    bottom: 3rem;
    right: 3rem;
  }
</style>
