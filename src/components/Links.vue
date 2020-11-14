<template>
  <article class="w-full mt-16 flex flex-col gap-12 items-center">
    <section class="w-full flex justify-center gap-12">
      <template v-for="(list, index) in lists" :key="index">
				<wp-linklist :title="list.title" :items="list.items" :color="sectionColor(index)" />
      </template>
    </section>
    <section>
      <button
        class="flex gap-2"
        @click="
          lists.length < 5
            ? lists.push({ title: 'New category', items: [] })
            : undefined
        "
      >
        <svg
          class="h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"
          />
        </svg>
        Add section
      </button>
    </section>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import LinkList from './util/LinkList.vue'

export default defineComponent({
  components: {
		'wp-linklist': LinkList,
  },
  data() {
    return {
      currentID: 0,
      lists: [
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
      ],
    }
  },
  methods: {
    sectionColor(idx) {
      const colors = ['bg-red', 'bg-blue', 'bg-green', 'bg-purple', 'bg-aqua']
      return colors[idx]
    },
		removeSection(idx) {
      this.lists.splice(idx, 1);
		},
  },
})
</script>

<style lang="postcss" scoped></style>
