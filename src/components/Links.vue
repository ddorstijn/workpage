<template>
  <article class="">
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
