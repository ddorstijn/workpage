<template>
  <article class="w-full flex flex-col overflow-hidden">
    <header class="mx-auto mb-6">
			<button class="w-full flex justify-center items-center gap-2" @click="viewDone = !viewDone">
				<h2 class="text-3xl"> {{ viewDone ? 'Done' : 'Todo' }}</h2>
				<svg
					class="h-10 fill-current"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
				>
					<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
					<path
						fill-rule="evenodd"
						d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
    </header>

		<section class="bg-dark p-2 px-4 mb-2 rounded shadow-lg">
			<h2 class="font-bold">Current task:</h2>
				<wp-draggable tag="ul" class="py-1 rounded" group="tasks" :list="doing" filter="textarea" :preventOnFilter="false">
					<p v-if="doing.length == 0" class="text-sm text-gray-lighter">
						You currently do not have a task you are working on. Drag an
						item here to start working on it.
					</p>
					<template v-for="task in doing" :key="task.id">
							<wp-task
								v-model:title="task.title"
								:created="task.created"
								:due="task.due"
								:spent="task.spent"
								:estimate="task.estimate"
							/>
						</template>
				</wp-draggable>
		</section>
		<div v-if="viewDone">
        <template v-for="task in done" :key="task.id">
          <wp-task
            v-model:title="task.title"
            :created="task.created"
            :due="task.due"
            :spent="task.spent"
            :estimate="task.estimate"
          />
        </template>
		</div>
    <section v-else class="min-h-0 flex-1 flex-grow overflow-auto">
      <wp-draggable tag="ul" group="tasks" :list="tasks" filter="textarea" :preventOnFilter="false" @start="startDrag" @end="endDrag">
        <template v-for="task in tasks" :key="task.id">
          <wp-task
            v-model:title="task.title"
            :created="task.created"
            :due="task.due"
            :spent="task.spent"
            :estimate="task.estimate"
            @remove="removeTask(task)"
          />
        </template>
      </wp-draggable>
    </section>
		<section>
			<wp-draggable v-if="dragging" class="flex p-4 bg-green" :list="done" group="tasks">
				Mark as completed!
			</wp-draggable>
			<button v-else class="flex justify-center gap-2 items-center mt-4 mx-auto" @click="addTask">
				<span>Add a new task</span>
				<svg
					class="h-6 fill-current"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</section>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import TaskItem from './util/TaskItem.vue'

export default defineComponent({
  components: {
    'wp-draggable': VueDraggableNext,
    'wp-task': TaskItem,
  },
	data() {
		return {
			viewDone: false,
			dragging: false,
			currentID: 1,
			tasks: [],
			doing: [],
			done: [],
		}
	},
	methods: {
    addTask() {
      this.tasks.push({
        id: this.currentID++,
        title: '',
        created: new Date(),
        due: new Date(),
        spent: '0h 0m',
        estimate: '0h 0m',
			})
    },
    removeTask(item: any) {
      const index = this.tasks.indexOf(item)
      if (index > -1) {
        this.tasks.splice(index, 1)
      }
    },
		startDrag(ev) {
			this.dragging = true
		},
		endDrag(ev) {
			this.dragging = false
		},
	},
})
</script>
