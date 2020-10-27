<template>
  <article class="mt-auto">
    <section
      v-if="expanded"
      class="flex flex-col gap-2"
      :class="{ open: expanded }"
    >
      <wp-draggable class="dragarea">
        <wp-list-item
          title="Google"
          details="www.google.com"
          icon="https://cdn-media-1.freecodecamp.org/images/0*xkJgg-6HskYrQ3N7.jpeg"
          details-editable
        />
        <wp-list-item
          title="Google"
          details="www.google.com"
          icon="https://cdn-media-1.freecodecamp.org/images/0*xkJgg-6HskYrQ3N7.jpeg"
          details-editable
        />
        <wp-list-item
          title="Google"
          details="www.google.com"
          icon="https://cdn-media-1.freecodecamp.org/images/0*xkJgg-6HskYrQ3N7.jpeg"
          details-editable
        />
        <wp-list-item
          title="Google"
          details="www.google.com"
          icon="https://cdn-media-1.freecodecamp.org/images/0*xkJgg-6HskYrQ3N7.jpeg"
          details-editable
        />
      </wp-draggable>
    </section>

    <header
      class="flex justify-center items-center px-4 py-2 cursor-pointer select-none"
      :class="{ open: expanded }"
      @click="expanded = !expanded"
    >
      <h2 class="text-2xl flex items-center gap-1">
        <svg
          class="h-6 stroke-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        Links
      </h2>
    </header>
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
.dragarea:empty {
  @apply bg-dark rounded h-1 m-4;
}
</style>
