<template>
  <article class="relative w-full flex flex-col">
    <header class="mx-auto mb-6">
      <button
        class="w-full flex justify-center items-center gap-2"
        @click="viewDone = !viewDone"
      >
        <h2 class="text-3xl">{{ viewDone ? 'Done' : 'Todo' }}</h2>
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
      <wp-draggable
        tag="ul"
        class="py-1 rounded"
        group="tasks"
        :list="doing"
        filter="textarea"
        :preventOnFilter="false"
        ghost-class="hidden"
        @start="dragging = true"
        @end="dragging = false"
        @change="onChange"
      >
        <p v-if="doing.length == 0" class="text-sm text-gray-lighter">
          You currently do not have a task you are working on. Drag an item here
          to start working on it.
        </p>
        <template v-for="task in doing" :key="task.id">
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
    <div v-if="viewDone">
      <p v-if="done.length == 0" class="mt-4 text-center text-sm text-gray">
        You currently don't have any tasks marked as done.
      </p>
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
      <wp-draggable
        class="mb-2"
        tag="ul"
        group="tasks"
        :list="tasks"
        filter="textarea"
        :preventOnFilter="false"
        @start="dragging = true"
        @end="dragging = false"
      >
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
      <wp-draggable
        v-if="dragging"
        class="flex p-4 bg-green"
        :list="done"
        group="tasks"
        ghost-class="hidden"
      >
        Mark as completed!
      </wp-draggable>
      <button
        v-else-if="!viewDone"
				ref="addTask"
        class="flex justify-center gap-2 items-center mt-4 mx-auto"
        @click="creating = true"
      >
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
		<section v-if="creating" class="absolute inset-x-0 p-2 pt-24 h-full overflow-visible">
			<div ref="createPopup" class="p-6 bg-dark-lighter rounded-lg shadow-xl">
				<header class="flex justify-center text-2xl mb-6 mt-2">Add new task</header>
				<form class="flex flex-col gap-4" @submit.prevent="addTask">
					<label class="flex justify-between items-center">
						Task name:
						<textarea 
							id="title"
							name="title"
							ref="newTitle"
							rows="1"
							required
							class="font-sans tracking-wide text-base bg-light-lighter text-dark-darker rounded resize-none p-1"
							@keydown.enter.prevent="$event.target.blur()"
							@input="resize"
						/>
					</label>

					<div class="flex justify-between items-center">
						Time estimate:
						<div class="flex justify-between gap-2">
							<label class="flex gap-1 items-center text-light-lighter">
								Hours: 
								<input id="goal-hours" type="number" name="goal-hours" size="2" class="bg-light-lighter text-dark-darker rounded p-1 w-12" />
							</label>
							<label class="flex gap-1 items-center text-light-lighter">
								Minutes: 
								<input id="goal-minutes" type="number" name="goal-minutes" size="2" class="bg-light-lighter text-dark-darker rounded p-1 w-12" />
							</label>
						</div>
					</div>
					
					<label class="flex justify-between items-center">
						Due date:
						<input id="due" name="due" type="date" class="bg-light-lighter text-dark-darker rounded p-1" />
					</label>

					<input type="submit" value="Add task" class="bg-green-dark p-2 mx-8" />
				</form>
			</div>
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
			creating: false,
      currentID: 1,
      tasks: [],
      doing: [],
      done: [],
    }
  },
	watch: {
		creating(newVal, oldVal) {
			if (oldVal == false && newVal == true) {
        document.addEventListener('click', this.handleDocumentClick)

				this.$nextTick(() => {
					this.$refs.newTitle.focus();
				});
			} else if (oldVal == true && newVal == false) {
				document.removeEventListener('click', this.handleDocumentClick)
			}
		}
	},
  methods: {
    addTask(evt) {
			const formData = new FormData(evt.target);

			const title = formData.get('title');
			const due = formData.get('due');
			const goalHours = formData.get('goal-hours');
			const goalMinutes = formData.get('goal-minutes');

      this.tasks.push({
        id: this.currentID++,
        title: title,
        created: new Date(),
        due: due,
        spent: '0h 0m',
        estimate: `${goalHours}h ${goalMinutes}m`,
      });

			this.creating = false;
    },
    removeTask(item: any) {
      const index = this.tasks.indexOf(item)
      if (index > -1) {
        this.tasks.splice(index, 1)
      }
    },
    onChange(evt) {
      if (evt.added) {
        if (this.doing.length > 1) {
          this.tasks.unshift(this.doing[1 - evt.added.newIndex])
        }

        this.doing = [evt.added.element]
      }
    },
    resize() {
			this.$refs.newTitle.style.height = 'auto';
      this.$refs.newTitle.style.height = `${this.$refs.newTitle.scrollHeight}px`
    },
		handleDocumentClick(e) {
			if (this.$refs.createPopup.contains(e.target) || this.$refs.addTask.contains(e.target)) {
				return;
			}

			this.creating = false;
		},
  },
})
</script>
