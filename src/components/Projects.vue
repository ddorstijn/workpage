<template>
  <article>
    <button
      class="flex justify-center items-center cursor-pointer select-none bg-light-lighter text-dark-darker py-1 pr-4 rounded mt-4 mx-auto"
      @click="open = true"
    >
      <h2 class="text-2xl flex items-center gap-1">
        <svg
          class="h-6 pl-2 pr-1 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path
            fill-rule="evenodd"
            d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        {{ activeProject }}
      </h2>
    </button>

    <div
      v-show="open"
      class="absolute top-0 left-0 w-full h-full p-16"
      @click.self="open = false"
    >
      <article class="bg-dark-darkest w-full h-full border rounded-xl p-8">
				<header class="flex justify-between">
					<h1 class="text-3xl">Projects</h1>
					<button @click="open = false">
						<svg class="h-8 text-gray hover:text-light-lighter fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
						</svg>
					</button>
				</header>

				<div>
					<div>
						Current active item:
						<wp-draggable>
							<wp-project v-for="project in activeProject">
						</wp-draggable>
					</div>

					<section v-for="list in projects" :key="list.title">
						<header>
							{{ list.title }}
						</header>
						<wp-draggable 
							tag="ul" 
							group="projects" 
							:list="list.items"
							filter="textarea" 
							:preventOnFilter="false"
						>
							<wp-project
								v-for="project in list.items" 
								:key="project.id"

								v-model:title="project.title"
								:created="project.created"
								@remove="removeProject(project)"
							/>
						</wp-draggable>
					</section>

				</div>
      </article>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import ProjectItem from './util/ProjectItem.vue'

export default defineComponent({
  components: {
    'wp-project': ProjectItem,
    'wp-draggable': VueDraggableNext,
  },
	data() {
		return {
			open: false,
			projects: [
				{
					title: "Love you",
					items: [
						{
							id: 0,
							title: "Titisa",
							created: new Date()
						}
					],
				}
			],
			currentID: 0,
			activeProject: "Default",
		}
	},
})
</script>
