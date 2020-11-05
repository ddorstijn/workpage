<template>
  <article class="w-full mt-16 flex flex-col gap-12 items-center">
    <section class="w-full flex justify-center gap-12">
      <template v-for="(list, index) in lists" :key="index">
        <div class="h-full flex flex-col gap-2 w-3/12 shadow-lg">
          <header
            class="text-2xl px-4 py-1"
            :class="{
              'bg-red-lighter': index == 0,
              'bg-blue-lighter': index == 1,
              'bg-green': index == 2,
            }"
          >
            {{ list.title }}
          </header>
          <div class="bg-light-lighter text-dark-darker p-2 px-4">
            <template v-if="list.items.length == 0">
              <p>There are no items here yet</p>
            </template>
            <template v-for="link in list.items" :key="link.id">
              <div class="flex items-center my-2">
                {{ link.title }}
              </div>
            </template>
          </div>
        </div>
      </template>
    </section>
    <section class="grid grid-cols-2 divide-x">
      <button
        class="px-4 text-right"
        @click="lists[0].items.push({ id: current_id++, title: 'New item' })"
      >
        Add bookmark
      </button>
      <button
        class="px-4 text-left"
        @click="lists.push({ title: 'New category', items: [] })"
      >
        Add catalogue
      </button>
    </section>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

export default defineComponent({
  components: {
    'wp-draggable': VueDraggableNext,
  },
  setup() {
    const currentID = ref(0)
    const lists = ref([
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
    ])

    return {
      currentID,
      lists,
    }
  },
})
</script>

<style lang="postcss" scoped></style>
