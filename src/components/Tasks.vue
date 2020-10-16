<template>
  <article class="m-2 h-full">
    <header class="collapsible-header">
      <h2 class="text-3xl">
        Tasks
      </h2>
      <button class="material-icons ml-auto text-2xl text-light-darkest">
        chevron_right
      </button>
    </header>
    <div class="relative">
      <button
        class="material-icons my-3 mx-8 text-xl absolute right-0"
        @click="addTask"
      >
        add
      </button>
      <section
        v-for="list in lists"
        :key="list.title"
        class="py-2 px-4 bg-dark-darker shadow-lg mb-1 ml-2"
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
            v-model:title="task.title"
            v-model:details="task.details"
            class="shadow"
            @remove="removeItem(list, task)"
          />
        </wp-draggable>
      </section>
    </div>
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
    const { lists, addItem, removeItem, addList } = useList()
    const taskLists = ['Todo', 'Doing', 'Done']
    for (const list of taskLists) {
      addList(list)
    }

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

<style lang="postcss">
.collapsible-header {
  @apply flex justify-start items-center py-3 pl-8 pr-3 mb-2 cursor-pointer select-none bg-dark shadow-xl;
}

.dragarea:empty {
  @apply bg-dark rounded h-1 m-4;
}
</style>
