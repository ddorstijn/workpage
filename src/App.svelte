<script lang="ts">
  import Clock from "./lib/Clock.svelte";
  import Links from "./lib/Links.svelte";
  import Modal from "./lib/modals/Modal.svelte";
  import Projects from "./lib/Projects.svelte";
  import Sidebar from "./lib/menu/Sidebar.svelte";
  import Tasks from "./lib/Tasks.svelte";
  
  import { darkmode } from "./store";
</script>

<article class="newtab" class:darkmode={$darkmode}>
  <Sidebar />

  <main>
    <Clock />
    <Projects />
    <Links />
  </main>
  <aside>
    <Tasks />
  </aside>

  <Modal />
</article>

<style lang="scss">
article.newtab {
	--bg-color: #ffffff;
	--bg-secondary-color: #f3f3f6;
	--color-primary: #14854F;
	--color-lightGrey: #d2d6dd;
	--color-grey: #747681;
	--color-darkGrey: #3f4144;
	--color-error: #d43939;
	--color-success: #28bd14;
	--grid-maxWidth: 120rem;
	--grid-gutter: 2rem;
	--font-size: 1.6rem;
	--font-color: #333333;
	--font-family-sans: "Inter", sans-serif;
	--font-family-mono: monaco, "Consolas", "Lucida Console", monospace;

	height: 100vh;
	width: 100vw;

	display: flex;
	background-color: var(--bg-secondary-color);

	&.darkmode {
		filter: invert(100%);
	}
}

main {
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

aside {
  width: 25vw;
}
</style>
