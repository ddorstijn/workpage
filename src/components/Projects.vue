<template>
  <article class="absolute w-full flex flex-col items-center">
    <header
      class="collapsible-header"
      :class="{ open: expanded }"
      @click="expanded = !expanded"
    >
      <h2 class="text-3xl flex items-end gap-1">
				<svg class="h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
				</svg>
        Projects
      </h2>
      <!-- <button class="material-icons ml-auto text-2xl text-light-darkest">
        expand_more
      </button> -->
    </header>
    <transition
      name="slide-up"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave"
      v-bind:css="false"
    >
      <section
        v-if="expanded"
        class="collapsible-body"
        :class="{ open: expanded }"
      >
        <wp-draggable class="dragarea">
          <wp-list-item
            title="Workpage"
            details="Personal"
            details-editable
          />
          <wp-list-item
            title="Lamp ophangen"
            details="Personal"
            details-editable
          />
          <wp-list-item
            title="Quizzer"
            details="Work"
            details-editable
          />
          <wp-list-item
            title="VuR"
            details="Personal"
            details-editable
          />
        </wp-draggable>
      </section>
    </transition>
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
  @apply flex justify-center items-center px-4 py-2 mt-2;
  @apply cursor-pointer select-none bg-dark shadow-xl;
  @apply transition-all duration-500 ease-in-out;
}

.collapsible-header > h2 {
  @apply transition-all duration-500 ease-in-out;
}

.collapsible-header.open {
  @apply my-2;
}

.collapsible-header.open > h2 {
}

.collapsible-body {
  @apply relative flex mb-0 p-0 w-full;
  @apply bg-dark-darker;
  transition: all 0.5s ease;
}

.collapsible-body.open {
  @apply mb-2 p-2;
}

.dragarea {
  @apply grid grid-cols-4 grid-flow-row gap-2;
  @apply w-full;
}

.dragarea:empty {
  @apply bg-dark rounded h-1 m-4;
}

</style>
