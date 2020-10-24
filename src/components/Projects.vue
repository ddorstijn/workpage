<template>
  <article class="m-4 h-full border-2 border-light-darker rounded-lg">
    <header
      class="collapsible-header"
      :class="{ open: expanded }"
      @click="expanded = !expanded"
    >
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
    <section
      v-if="expanded"
      class="collapsible-body"
      :class="{ open: expanded }"
    >
      <wp-draggable class="w-full flex flex-col gap-2">
        <wp-list-item title="Workpage" details="Personal" details-editable />
        <wp-list-item
          title="Lamp ophangen"
          details="Personal"
          details-editable
        />
        <wp-list-item title="Quizzer" details="Work" details-editable />
        <wp-list-item title="VuR" details="Personal" details-editable />
      </wp-draggable>
    </section>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import useList from '/src/modules/list'
import ListItem from './util/ListItem.vue'

export default defineComponent({
  components: {
    'wp-draggable': VueDraggableNext,
    'wp-list-item': ListItem,
  },
  setup() {
    const expanded = ref(true)
    const startLists = [{ title: '', items: [] }]
    const { lists, addItem, removeItem } = useList(startLists)

    return {
      expanded,

      lists,
      addItem,
      removeItem,
    }
  },
})
</script>

<style lang="postcss" scoped>
.collapsible-header {
  @apply flex justify-center items-center px-4 py-2 mt-2;
  @apply cursor-pointer select-none;
}

.collapsible-body {
  @apply relative flex mb-0 p-0 w-full;
  transition: all 0.5s ease;
}

.collapsible-body.open {
  @apply mb-2 p-2;
}

.dragarea:empty {
  @apply bg-dark rounded h-1 m-4;
}
</style>
