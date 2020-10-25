<template>
  <article class="mt-auto flex flex-col justify-end m-4 border-2 border-light-darkest rounded-lg shadow-lg">
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
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Links
      </h2>
    </header>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import Velocity from 'velocity-animate'
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

    const beforeEnter = (el: HTMLElement) => {
      console.log('starting transition')
      el.style.maxHeight = 0
    }
    const enter = (el: HTMLElement, done) => {
      Velocity(el, { maxHeight: '100%' }, { duration: 300, complete: done })
      console.log('Done enter')
    }
    const leave = (el: HTMLElement, done) => {
      Velocity(el, { maxHeight: '0%' }, { duration: 300, complete: done })
    }

    return {
      expanded,

      lists,
      addItem,
      removeItem,

      beforeEnter,
      enter,
      leave,
    }
  },
})
</script>

<style lang="postcss" scoped>
.collapsible-header {
  @apply flex justify-center items-center px-4 py-2;
  @apply cursor-pointer select-none;
}

.collapsible-body {
  @apply relative flex mb-0 p-0 w-full;
}

.dragarea:empty {
  @apply bg-dark rounded h-1 m-4;
}
</style>
