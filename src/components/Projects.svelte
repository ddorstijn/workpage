<script>
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import * as db from "@/lib/database/LoveFieldModule";

  import { modal, project } from "@/lib/store";
  import DrawerModal from "./modals/DrawerModal.svelte";

  onMount(async () => {
    if (!(await db.projects.get($project)).length) {
      $project = null;
    }
  });

  function openModal() {
    modal.set(DrawerModal);
  }
</script>

<article>
  <button class="[ button primary ]" on:click={openModal}>
    {#if $project == null}
      {$_("projects.non-selected")}
    {:else}
      {$project.name}
    {/if}
  </button>
</article>

<style>
  button {
    padding: 12px 24px;

    border-radius: 999px;
    box-shadow: rgb(0 0 0 / 10%) 0px 2px 6px, rgb(0 0 0 / 10%) 0px 4px 16px;

    font-size: 1.8rem;
    font-weight: 600;
    letter-spacing: -0.2px;
  }
</style>
