<template>
  <article class="w-full mt-16 flex flex-col gap-12 items-center">
    <section class="w-full flex justify-center gap-12">
      <template v-for="(list, index) in lists" :key="index">
        <div class="h-full flex flex-col gap-2 w-3/12 shadow-lg">
          <header
            class="text-2xl px-4 py-1"
            :class="sectionColor(index)"
          >
            {{ list.title }}
          </header>
					<section class="bg-light-lighter text-dark-darker p-2 px-4 divide-y divide-light-darker">
						<wp-draggable :list="list.items" group="links">
							<template v-if="list.items.length == 0">
								<p>There are no items here yet</p>
							</template>
							<template v-for="link in list.items" :key="link.id">
								<div class="flex items-center my-2">
									{{ link.title }}
								</div>
							</template>
						</wp-draggable>
						<button class="w-full text-sm flex gap-1 items-center pt-1">
							<svg class="h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
							</svg>
							Add bookmark
						</span>
					</button>
        </div>
      </template>
    </section>
    <section>
      <button
        class="flex gap-2"
        @click="lists.length < 5 ? lists.push({ title: 'New category', items: [] }) : undefined"
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
			const colors = ["bg-red", "bg-blue", "bg-green", "bg-purple", "bg-aqua"];
			return colors[idx];
		}
	},
})
</script>

<style lang="postcss" scoped></style>
