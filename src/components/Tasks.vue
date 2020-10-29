<template>
  <article class="w-full h-full">
    <header class="flex justify-center items-center gap-2 mb-6">
      <h1 class="text-3xl">Todo</h1>
      <svg
        class="h-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path
          fill-rule="evenodd"
          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
    </header>

    <section>
      <div class="bg-dark p-2 px-4 rounded">
        <h2 class="font-bold">Current task:</h2>
        <wp-draggable>
          <wp-task
            class="pl-3 py-1 rounded"
            title="The task that is currently on the doing task field"
            due="28 Oct"
            spent="22h 12m"
            estimate="25h 0m"
            doing
          >
          </wp-task>
        </wp-draggable>
      </div>
			<div class="max-h-1/2-screen overflow-auto">
				<wp-draggable
					group="tasks"
					:list="todoList"
				>
					<wp-task
						v-for="task in todoList"
						:key="task.id"
						class="py-2 pl-4 rounded"
						v-model:title="task.title"
						:due="task.details.due"
						:spent="task.details.spent"
						:estimate="task.details.estimate"
						@remove="removeTask(task)"
					>
					</wp-task>
				</wp-draggable>
			</div>
    </section>
    <button
      class="flex justify-center gap-2 items-center mt-4 mx-auto"
      @click="addTask"
    >
      <span>Add a new goal</span>
      <svg
        class="h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import useList from '/src/modules/list'
import TaskItem from './util/TaskItem.vue'

export default defineComponent({
  components: {
    'wp-draggable': VueDraggableNext,
    'wp-task': TaskItem,
  },
  setup() {
    const todoList = ref([
      {
        id: 0,
        title:
          'Create a yocto recipe that auto inits the different gadget drivers',
        details: {
          created: new Date('22 Nov 2020'),
          due: new Date('25 Nov 2020'),
          spent: '2h 0m 24s',
          estimate: '3h 0m',
        },
      },
      {
        id: 1,
        title: 'Create a script that initializes configfs',
        details: {
          created: new Date('22 Nov 2020'),
          due: new Date('25 Nov 2020'),
          spent: '2h 0m 24s',
          estimate: '2h 20m',
        },
      },
      {
        id: 2,
        title: 'Allow for the creation of ACM ECM and RNDIS drivers',
        details: {
          created: new Date('22 Nov 2020'),
          due: new Date('25 Nov 2020'),
          spent: '2h 0m 24s',
          estimate: '1h 30m',
        },
      },
      {
        id: 3,
        title: 'Create the hid driver',
        details: {
          created: new Date('22 Nov 2020'),
          due: new Date('25 Nov 2020'),
          spent: '2h 0m 24s',
          estimate: '1h 30m',
        },
      },
      {
        id: 4,
        title: 'Test the tool with a Windows host PC',
        details: {
          created: new Date('22 Nov 2020'),
          due: new Date('25 Nov 2020'),
          spent: '2h 0m 24s',
          estimate: '1h 30m',
        },
      },
      {
        id: 5,
        title: 'Build the Kappl project',
        details: {
          created: new Date('22 Nov 2020'),
          due: new Date('25 Nov 2020'),
          spent: '2h 0m 24s',
          estimate: '1h 30m',
        },
      },
      {
        id: 6,
        title: 'Install Cygwin with Perl and XML support',
        details: {
          created: new Date('22 Nov 2020'),
          due: new Date('25 Nov 2020'),
          spent: '2h 0m 24s',
          estimate: '1h 30m',
        },
      },
      {
        id: 7,
        title: 'Build Kappl for ARM devices',
        details: {
          created: new Date('22 Nov 2020'),
          due: new Date('25 Nov 2020'),
          spent: '2h 0m 24s',
          estimate: '1h 30m',
        },
      },
    ])
    const { addItem, removeItem } = useList()

    const addTask = () => {
      const today = new Date()
      const item = {
        id: -1,
        title: '',
        details: {
          created: today,
          due: new Date('25 Aug 2020'),
          spent: '0h 0m',
          estimate: '1h 0m',
        },
      }

      addItem(todoList.value, item, true)
    }

    const removeTask = (item) => {
      removeItem(todoList.value, item)
    }

    return {
      todoList,
      addItem,
      removeItem,
      addTask,
      removeTask,
    }
  },
})
</script>
