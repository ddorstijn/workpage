<template>
  <article class="h-full w-full">
    <header class="flex gap-8 justify-center">
      <h2 class="text-2xl flex items-center gap-1 cursor-pointer">
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

    <section v-for="list in lists" :key="list.title" class="w-full h-auto mt-6">
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
        >
          <template #icon>
            <svg
              class="h-full text-green"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 10 m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </template>
        </wp-list-item>
      </wp-draggable>
    </section>
    <button class="w-full h-12 flex justify-center items-center p-4">
      <span>Add a new goal</span>
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
            title:
              'Create a yocto recipe that auto inits the different gadget drivers',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 1,
            title: 'Create a script that initializes configfs',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 2,
            title: 'Allow for the creation of ACM ECM and RNDIS drivers',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 3,
            title: 'Create the hid driver',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 4,
            title: 'Test the tool with a Windows host PC',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 5,
            title: 'Build the Kappl project',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 6,
            title: 'Install Cygwin with Perl and XML support',
            details: 'Created: 22 Nov, Spent: 2h 0m 24s',
          },
          {
            id: 7,
            title: 'Build Kappl for ARM devices',
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
