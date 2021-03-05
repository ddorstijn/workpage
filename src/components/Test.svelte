<script>
	import { activeId } from "../store.js";
</script>
{$activeId}
<button on:click={() => $activeId++}>Add 1</button>
