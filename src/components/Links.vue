<template>
  <article class="w-full mt-16 flex flex-col gap-12 items-center">
    <section class="flex justify-between w-full">
      <div
        v-for="(list, idx) in lists"
        :key="list.title"
        class="flex flex-col gap-2 w-3/12"
      >
        <header
          class="text-2xl px-4 py-1"
          :class="{
            'bg-red-lighter': idx == 0,
            'bg-blue-lighter': idx == 1,
            'bg-green': idx == 2,
          }"
        >
          {{ list.title }}
        </header>
        <wp-draggable class="bg-light-lighter text-dark-darker p-2 px-4">
          <div
            v-for="link in list.items"
            :key="link.id"
            class="flex items-center my-2"
          >
            {{ link.title }}
          </div>
        </wp-draggable>
      </div>
    </section>
    <section class="grid grid-cols-2 divide-x">
      <button class="px-4 text-right">Add bookmark</button>
      <button class="px-4 text-left">Add catalogue</button>
    </section>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import useList from '/src/modules/list'

export default defineComponent({
  components: {
    'wp-draggable': VueDraggableNext,
  },
  setup() {
    const startLists = [
      {
        title: 'Articles',
        items: [
          {
            id: 0,
            title: 'Changing the world',
          },
          {
            id: 1,
            title: 'Google.com',
          },
          {
            id: 2,
            title: 'Google.com',
          },
          {
            id: 3,
            title: 'Google.com',
          },
        ],
      },
      {
        title: 'Utilities',
        items: [
          {
            id: 0,
            title: 'Email',
          },
          {
            id: 1,
            title: 'One drive',
          },
          {
            id: 2,
            title: 'Teams',
          },
          {
            id: 3,
            title: 'Calendar',
          },
        ],
      },
      {
        title: 'Sources',
        items: [
          {
            id: 0,
            title: 'Reddit',
          },
          {
            id: 1,
            title: 'Wikipedia',
          },
          {
            id: 2,
            title: 'Youtube',
          },
          {
            id: 3,
            title: 'Google',
          },
        ],
      },
    ]
    const { lists, addItem, removeItem } = useList(startLists)

    return {
      lists,
      addItem,
      removeItem,
    }
  },
})
</script>

<style lang="postcss" scoped></style>
