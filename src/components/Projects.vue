<template>
  <article class="m-4 border-2 border-light-darkest rounded-lg shadow-lg cursor-pointer select-none">
    <header class="flex justify-center items-center m-2">
      <h2 class="text-2xl flex items-center gap-1">
        <svg
          class="h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
        Projects
      </h2>
    </header>
    <section class="relative flex mb-0 p-0 w-full">
        <wp-list-item title="Quizzer" details="Work" details-editable />
    </section>
  </article>
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

