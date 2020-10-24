<template>
  <article class="m-4 h-full border-2 border-light-darker rounded-lg">
    <header
      class="flex justify-center items-center cursor-pointer select-none"
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        Tasks
      </h2>
    </header>

      <div v-if="expanded" class="collapsible-body">
        <button class="my-3 mx-8 text-xl absolute right-0" @click="addTask">
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
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
        <section
          v-for="(list, index) in lists"
          :key="list.title"
          class="py-2 px-4 bg-dark-darker shadow-lg mb-1"
          :style="`--list-idx: ${index}`"
        >
          <h3 class="text-2xl mb-2">
            {{ list.title }}
          </h3>
          <wp-draggable
            group="tasks"
            :list="list.items"
            class="flex flex-col gap-2 dragarea"
          >
            <wp-list-item
              v-for="task in list.items"
              :key="task.id"
              class="shadow"
              v-model:title="task.title"
              v-model:details="task.details"
              @remove="removeItem(list, task)"
            />
          </wp-draggable>
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
    const startLists = [
      { title: 'Todo', items: [] },
      { title: 'Doing', items: [] },
      { title: 'Done', items: [] },
    ]
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
