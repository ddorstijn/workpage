<template>
  <article class="absolute bottom-0 w-full flex flex-col items-center">
    <header
      class="collapsible-header"
      :class="{ open: expanded }"
      @click="expanded = !expanded"
    >
      <span class="material-icons">book</span>
      <h2 class="text-3xl">
        Links
      </h2>
      <!-- <button class="material-icons ml-auto text-2xl text-light-darkest">
        expand_more
      </button> -->
    </header>

    <transition name="slide-up">
      <section
        v-show="expanded"
        class="collapsible-body"
      >
        <wp-draggable class="dragarea">
          <wp-list-item
            title="Google"
            details="www.google.com"
            icon="www.google.com"
            details-editable
          />
          <wp-list-item
            title="Google"
            details="www.google.com"
            icon="www.google.com"
            details-editable
          />
          <wp-list-item
            title="Google"
            details="www.google.com"
            icon="www.google.com"
            details-editable
          />
          <wp-list-item
            title="Google"
            details="www.google.com"
            icon="www.google.com"
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
  @apply ;

  @apply flex justify-center items-center w-32;
  @apply cursor-pointer select-none bg-dark shadow-xl;
  @apply transition-all duration-500 ease-in-out;
}

.collapsible-header > h2 {
  @apply transition-all duration-500 ease-in-out;
}

.collapsible-header:hover:not(.open) {
}

.collapsible-header:hover:not(.open) > h2 {
}

.collapsible-header.open {
  @apply my-2;
}

.collapsible-header.open > h2 {
}

.collapsible-body {
  @apply relative flex mb-2 p-2 w-full;
  @apply transition-all duration-500 ease-in-out;
  @apply bg-dark-darker;
}

.dragarea {
  @apply grid grid-cols-4 grid-flow-row gap-2;
  @apply w-full;
}

.dragarea:empty {
  @apply bg-dark rounded h-1 m-4;
}

.slide-up-enter-to,
.slide-up-leave-from {
	@apply top-0;
}

.slide-up-enter-from,
.slide-up-leave-to {
	@apply top-100;
}
</style>
