<script lang="ts">
  import browser from "webextension-polyfill";

  import { darkmode, editRef, project } from "@/lib/store";
  import type { Link } from "@/lib/database/types";

  import LinkModal from "@/components/modals/LinkModal.svelte";

	async function getAddress() {
    const tabs = await browser.tabs.query({active: true, lastFocusedWindow: true});
    let link: Link = { name: tabs[0]?.title, url: tabs[0]?.url };

    $editRef = link;
  };

  function close() {
    window.close();
  }
</script>

<svelte:head>
   {#if $darkmode}
      <style>
         body {
            filter: invert(100%);
            background: #000;
         }
      </style>
   {/if}
</svelte:head>	

<article>
  {#if !$project}
    <div class="no-project">
      <span>Not currently working on a project</span>
    </div>
  {:else}
    <span class="project-title">Current project: { $project?.name }</span>
    {#await getAddress()}
      Getting URL...
    {:then} 
      <LinkModal on:close={close} />
    {/await}
  {/if}
</article>

<style lang="scss">
  .project-title {
    display: block;
    text-align: center;
    margin-bottom: 2rem;
  }

  article {
    padding: 2rem;
    margin: 0;
    width: 300px;
  }

  .no-project {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
  }
</style>