<template>
  <article class="w-full mt-16 flex flex-col gap-12 items-center">
    <section class="w-full flex justify-center gap-12">
      <template v-for="(list, index) in lists" :key="index">
        <div class="h-full flex flex-col gap-2 w-3/12 shadow-lg">
          <header
            class="text-2xl px-4 py-1 flex justify-between"
            :class="sectionColor(index)"
          >
            <h2>{{ list.title }}</h2>
            <wp-popup>
              <svg
                class="h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
              <template #tooltip>
                <ul class="py-2 text-base">
                  <li
                    class="flex items-center px-2 cursor-pointer gap-1"
                    @click="editing = true"
                  >
                    <svg class="h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
											<path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
										</svg>
                    Add bookmark
                  </li>
                  <li
                    class="flex items-center px-2 cursor-pointer gap-1"
                    @click="removeSection(index)"
                  >
                    <svg
                      class="h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Delete section</span>
                  </li>
                </ul>
              </template>
            </wp-popup>
          </header>
          <section class="relative bg-light-lighter text-dark-darker p-2 px-4">
						<section v-if="creating" class="absolute inset-x-0 p-2 h-full overflow-visible">
							<div class="p-6 bg-dark rounded-lg shadow-xl" @click.stop="">
								<form class="flex flex-col gap-4 text-light-lighter" @submit.prevent="addTask">
									<label class="flex justify-between items-center gap-4">
										Title
										<input 
											id="title"
											class="font-sans text-base bg-light-lighter text-dark-darker rounded p-1 w-full"

											type="text"
											size="2"
											name="title"
											ref="newTitle"
											required
										/>
									</label>
									
									<label class="flex justify-between items-center gap-4 text-light-lighter">
										URL
										<input 
											id="title"
											class="font-sans text-base bg-light-lighter text-dark-darker rounded p-1 w-full"

											type="url"
											size="2"
											name="title"
											ref="newTitle"
											required
										/>
									</label>

									<input type="submit" class="bg-green-dark p-2 mx-8 rounded" value="Add bookmark" />
								</form>
							</div>
						</section>

            <wp-draggable :list="list.items" group="links">
              <template v-if="list.items.length == 0">
                <p>There are no items here yet</p>
              </template>
              <template v-for="link in list.items" :key="link.id">

                <div class="flex items-center justify-between my-2">
                  {{ link.title }}
									<wp-popup
										ref="popup"
										class="p-1 text-base text-light-darkest hover:text-dark-darker"
										placement="left"
									>
										<svg
											class="h-4"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
											/>
										</svg>
										<template #tooltip>
											<ul class="py-2 flex">
												<li
													class="flex items-center px-2 cursor-pointer hover:text-blue"
													@click="editing = true; $refs.popup.hide(); $nextTick(() => { $refs.title.focus() });"
												>
													<svg
														class="h-5"
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
														/>
													</svg>
												</li>
												<li
													class="flex items-center px-2 cursor-pointer hover:text-red"
													@click="list.items.splice(list.items.indexOf(link), 1)"
												>
													<svg
														class="h-5"
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fill-rule="evenodd"
															d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
															clip-rule="evenodd"
														/>
													</svg>
												</li>
											</ul>
										</template>
									</wp-popup>
                </div>
              </template>
            </wp-draggable>
          </section>
        </div>
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
import { VueDraggableNext } from 'vue-draggable-next'
import Popup from './util/Popup.vue'

export default defineComponent({
  components: {
    'wp-draggable': VueDraggableNext,
    'wp-popup': Popup,
  },
  data() {
    return {
			creating: true,
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
