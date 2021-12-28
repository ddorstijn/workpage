<script lang="ts">
  import browser from "webextension-polyfill";

  import { darkmode, editRef, project } from "@/lib/store";
  import type { Link } from "@/lib/database/types";

  import LinkModal from "@/components/modals/LinkModal.svelte";

	async function getAddress() {
    const tabs = await browser.tabs.query({active: true, lastFocusedWindow: true});
    let link: Link = { name: tabs[0].title, url: tabs[0].url };

    $editRef = link;
  };
</script>

<article class:darkmode={$darkmode}>
  <span class="project-title">Current project: { $project.name }</span>
  {#await getAddress()}
    Getting URL...
  {:then} 
    <LinkModal />
  {/await}
</article>

<style>
  .project-title {
    display: block;
    text-align: center;
    margin-bottom: var(--space-2);
  }
</style>