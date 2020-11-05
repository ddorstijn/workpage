<template>
  <article>
    <button
      class="flex justify-center items-center cursor-pointer select-none bg-light-lighter text-dark-darker py-1 pr-4 rounded mt-4 mx-auto"
      @click="open = true"
    >
      <h2 class="text-2xl flex items-center gap-1">
        <svg
          class="h-6 pl-2 pr-1 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path
            fill-rule="evenodd"
            d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        {{ projects[activeID] }}
      </h2>
    </button>

    <section
      v-show="open"
      class="absolute top-0 left-0 w-full h-full p-16"
      @click.self="open = false"
    >
      <div class="bg-dark-darkest w-full h-full border rounded-xl p-8">
        <h1 class="text-3xl">Projects</h1>
      </div>
    </section>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ListItem from './util/ListItem.vue'

export default defineComponent({
  components: {
    'wp-list-item': ListItem,
  },
  setup() {
    const open = ref(false)
    const projects = ref(['Project title'])
    const activeID = ref(0)

    return {
      open,
      projects,
      activeID,
    }
  },
})
</script>
