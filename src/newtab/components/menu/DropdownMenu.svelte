<script>
import { onMount } from "svelte";


  export let action;

  onMount(() => {
    window.addEventListener('');
  });
</script>

<div class="tooltip" role="tooltip" use:action >
  <ul>
    <li>Edit</li>
    <li>Remove</li>
  </ul>
</div>