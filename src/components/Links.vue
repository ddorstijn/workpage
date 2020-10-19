<template>
  <article class="h-full flex flex-col justify-end items-center">
    <header
      class="collapsible-header"
      :class="{ open: expanded }"
      @click="expanded = !expanded"
    >
      <h2 class="text-3xl">
        <span class="material-icons m-1">book</span>
        Links
      </h2>
      <button class="material-icons ml-auto text-2xl text-light-darkest">
        expand_more
      </button>
    </header>

    <transition name="slide-up">
      <div v-if="expanded" class="collapsible-body">
        <wp-draggable class="dragarea">
          <wp-list-item
            title="Google"
            details="www.google.com"
            :detailsEditable="true"
            icon="www.google.com"
          />
          <wp-list-item
            title="Google"
            details="www.google.com"
            :detailsEditable="true"
            icon="www.google.com"
          />
          <wp-list-item
            title="Google"
            details="www.google.com"
            :detailsEditable="true"
            icon="www.google.com"
          />
          <wp-list-item
            title="Google"
            details="www.google.com"
            :detailsEditable="true"
            icon="www.google.com"
          />
          <wp-list-item
            title="Google"
            details="www.google.com"
            :detailsEditable="true"
            icon="www.google.com"
          />
          <wp-list-item
            title="Google"
            details="www.google.com"
            :detailsEditable="true"
            icon="www.google.com"
          />
          <wp-list-item
            title="Google"
            details="www.google.com"
            :detailsEditable="true"
            icon="www.google.com"
          />
          <wp-list-item
            title="Google"
            details="www.google.com"
            :detailsEditable="true"
            icon="www.google.com"
          />
        </wp-draggable>
      </div>
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
    const expanded = ref(false)
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
  @apply relative flex justify-center items-center w-48 p-3 mb-2;
  @apply cursor-pointer select-none bg-dark shadow-xl;
  @apply transition-all duration-500 ease-in-out;
}

.collapsible-header > h2 {
  @apply transition-all duration-500 ease-in-out;
}

.collapsible-header:hover {
}

.collapsible-header:hover > h2 {
}

.collapsible-header.open {
}

.collapsible-header.open > h2 {
}

.collapsible-body {
  @apply relative flex w-full min-h-32 mb-2 p-6;
  @apply transition-all duration-500 ease-in-out;
  @apply bg-dark-darker;
}

.dragarea {
  @apply grid grid-cols-4 grid-rows-2 grid-flow-row gap-2;
  @apply w-full;
}

.dragarea:empty {
  @apply bg-dark rounded h-1 m-4;
}

.slide-up-enter-to,
.slide-up-leave-from {
}

.slide-up-enter-from,
.slide-up-leave-to {
}
</style>
