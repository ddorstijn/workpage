<template>
  <article class="">
    <header
      class="flex justify-center items-center m-2 cursor-pointer select-none"
      :class="{ open: expanded }"
      @click="expanded = !expanded"
    >
      <h2 class="text-2xl flex items-center gap-1">
        <svg
          class="h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fill-rule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      </h2>
    </header>

    <div v-if="expanded">
      <section
        v-for="(list, index) in lists"
        :key="list.title"
        class="py-2 px-4 mb-1"
        :style="`--list-idx: ${index}`"
      >
        <form class="w-full flex">
          <input class="bg-dark-darker w-full" />
          <input type="button" value="Add" class="bg-light text-dark" />
        </form>
        <wp-draggable
          group="tasks"
          :list="list.items"
          class="flex flex-col gap-2 dragarea"
        >
          <wp-list-item
            v-for="task in list.items"
            :key="task.id"
            v-model:title="task.title"
            v-model:details="task.details"
            class="shadow"
            @remove="removeItem(list, task)"
          />
        </wp-draggable>
      </section>
      <section>
        <wp-draggable> </wp-draggable>
      </section>
    </div>
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
    const startLists = [{ title: 'Todo', items: [] }]
    const { lists, addItem, removeItem } = useList(startLists)

    const addTask = () => {
      const date = new Date()
      const dateOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }

      const dateHuman = new Intl.DateTimeFormat('en-GB', dateOptions).format(
        date
      )
      const item = {
        id: -1,
        title: '',
        details: 'Created on ' + dateHuman,
      }

      addItem(lists.value[0], item, true)
    }

    return {
      expanded,

      lists,
      addItem,
      removeItem,
      addTask,
    }
  },
})
</script>

<style lang="postcss" scoped>
.dragarea:empty {
  @apply bg-dark rounded h-1 m-4;
}
</style>
