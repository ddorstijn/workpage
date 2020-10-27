<template>
  <button
    class="flex justify-center items-center cursor-pointer select-none bg-light-lighter text-dark-darker py-1 pr-4 rounded m-4"
  >
    <h2 class="text-2xl flex items-center gap-1">
      <svg
        class="h-6 pl-2 pr-1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
        <path
          fill-rule="evenodd"
          d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      Project title
    </h2>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ListItem from './util/ListItem.vue'

export default defineComponent({
  components: {
    'wp-list-item': ListItem,
  },
})
</script>
