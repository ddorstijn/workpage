<template>
  <article class="h-full w-full justify-self-start">
    <header class="flex gap-8">
      <form class="flex-grow flex justify-around items-center">
        <input
          placeholder="Add a new goal"
          class="w-full bg-transparent border-b-2"
        />
        <button class="h-6">
          <svg
            class="h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </form>
      <h2 class="text-2xl flex items-center gap-1 cursor-pointer select-none">
        <svg
          class="h-10"
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

    <section v-for="list in lists" :key="list.title" class="w-full mt-6">
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
          @remove="removeItem(list, task)"
        />
      </wp-draggable>
    </section>
    <section>
      <wp-draggable> </wp-draggable>
    </section>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import useList from '/src/modules/list'
import ListItem from './util/ListItem.vue'

export default defineComponent({
  components: {
    'wp-draggable': VueDraggableNext,
    'wp-list-item': ListItem,
  },
  setup() {
    const startLists = [
      {
        title: 'Todo',
        items: [
          {
            id: 0,
            title: 'This is an example todo',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 1,
            title: 'This is an example todo',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 2,
            title: 'This is another example todo',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 3,
            title: 'This is a crazy one',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 4,
            title: 'Example todo #5',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 5,
            title: 'This example todo number 6',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 6,
            title: 'This is an example todo',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 7,
            title: 'This is an example todo',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 8,
            title: 'This is an example todo',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
        ],
      },
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
