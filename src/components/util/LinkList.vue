<template>
        <div class="h-full flex flex-col gap-2 w-3/12 shadow-lg">
          <header
            class="text-2xl px-4 py-1 flex justify-between"
            :class="color"
          >
            <h2>{{ title }}</h2>
            <wp-popup placement="top-end" background-color="bg-dark" text-color="text-light-lighter">
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
                    class="flex items-center px-2 cursor-pointer gap-1 hover:bg-light"
                    @click="editing = true"
                  >
                    <svg class="h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
											<path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
										</svg>
                    Add bookmark
                  </li>
                  <li
                    class="flex items-center px-2 cursor-pointer gap-1 hover:bg-light"
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

            <wp-draggable :list="items" group="links">
              <template v-if="items.length == 0">
                <p>There are no items here yet</p>
              </template>
              <template v-for="link in items" :key="link.id">

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

<script>
import { defineComponent } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next'
import Popup from './Popup.vue'

 export default defineComponent({
	components: {
    'wp-draggable': VueDraggableNext,
    'wp-popup': Popup,
	},
	props: {
		title: { type: String, required: true },
		items: { type: Array, required: true },
		color: { type: String, required: true },
	},
	data() {
		return {
			creating: false,
		}
	}
 })
