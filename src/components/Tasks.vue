<template>
  <article class="m-2 h-full">
    <header class="flex justify-start items-end py-3 pl-8 pr-6 cursor-pointer select-none bg-dark shadow-xl">
      <h2 class="text-2xl">Tasks</h2>
      <button class="material-icons ml-auto text-xl" @click="addItem(lists[0], undefined, true)">add</button>
    </header>
    <section v-for="list in lists" :key="list.id" class="px-4 py-4 bg-dark-darker shadow-lg">
      <h3 class="text-xl mb-2">{{ list.title }}</h3>
      <wp-draggable group="tasks" :list="list.items" class="flex flex-col gap-2">
        <wp-list-item
          v-for="task in list.items"
          :key="task.title"
          :title="task.title"
          :details="task.details"
          @remove="removeItem(list, task)"
        />
      </wp-draggable>
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
    const { lists, addItem, removeItem, addList } = useList()
    const taskLists = ['Todo', 'Doing', 'Done']
    for (const list of taskLists) {
      console.log(list)
      addList(list)
    }

    return {
      lists,
      addItem,
      removeItem,
    }
  },
})
</script>
