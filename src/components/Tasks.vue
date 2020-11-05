<template>
  <!-- Tasks -->
  <article class="w-full h-full">
    <header class="flex justify-center items-center gap-2 mb-6">
      <h1 class="text-3xl">Todo</h1>
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
    </header>

    <section>
      <div class="bg-dark p-2 px-4 rounded">
        <h2 class="font-bold">Current task:</h2>
          <wp-draggable tag="ul" class="pl-3 py-1 rounded" group="tasks" :list="doing">
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
                  :completed="task.completed"
                  doing
                />
              </template>
          </wp-draggable>
      </div>
      <wp-draggable tag="ul" class="max-h-1/2-screen overflow-auto" group="tasks" :list="tasks">
        <!-- Task item -->
        <template v-for="task in tasks" :key="task.id">
          <wp-task
            v-model:title="task.title"
            :created="task.created"
            :due="task.due"
            :spent="task.spent"
            :estimate="task.estimate"
            :completed="task.completed"
            @remove="removeTask(task)"
          />
        </template>
      </wp-draggable>
    </section>
    <button
      class="flex justify-center gap-2 items-center mt-4 mx-auto"
      @click="addTask"
    >
      <span>Add a new goal</span>
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
  </article>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import TaskItem from './util/TaskItem.vue'

export default defineComponent({
  components: {
    'wp-draggable': VueDraggableNext,
    'wp-task': TaskItem,
  },
  setup() {
    const currentID = 0
    const doing = ref([])
    const tasks = ref([
      {
        id: 0,
        title:
          'Create a yocto recipe that auto inits the different gadget drivers',
        created: new Date('22 Nov 2020'),
        due: new Date('25 Nov 2020'),
        spent: '2h 0m 24s',
        estimate: '3h 0m',
        completed: false,
      },
      {
        id: 1,
        title: 'Create a script that initializes configfs',
        created: new Date('22 Nov 2020'),
        due: new Date('25 Nov 2020'),
        spent: '2h 0m 24s',
        estimate: '2h 20m',
        completed: false,
      },
      {
        id: 2,
        title: 'Allow for the creation of ACM ECM and RNDIS drivers',
        created: new Date('22 Nov 2020'),
        due: new Date('25 Nov 2020'),
        spent: '2h 0m 24s',
        estimate: '1h 30m',
        completed: false,
      },
      {
        id: 3,
        title: 'Create the hid driver',
        created: new Date('22 Nov 2020'),
        due: new Date('25 Nov 2020'),
        spent: '2h 0m 24s',
        estimate: '1h 30m',
        completed: false,
      },
      {
        id: 4,
        title: 'Test the tool with a Windows host PC',
        created: new Date('22 Nov 2020'),
        due: new Date('25 Nov 2020'),
        spent: '2h 0m 24s',
        estimate: '1h 30m',
        completed: false,
      },
      {
        id: 5,
        title: 'Build the Kappl project',
        created: new Date('22 Nov 2020'),
        due: new Date('25 Nov 2020'),
        spent: '2h 0m 24s',
        estimate: '1h 30m',
        completed: false,
      },
      {
        id: 6,
        title: 'Install Cygwin with Perl and XML support',
        created: new Date('22 Nov 2020'),
        due: new Date('25 Nov 2020'),
        spent: '2h 0m 24s',
        estimate: '1h 30m',
        completed: false,
      },
      {
        id: 7,
        title: 'Build Kappl for ARM devices',
        created: new Date('22 Nov 2020'),
        due: new Date('25 Nov 2020'),
        spent: '2h 0m 24s',
        estimate: '1h 30m',
        completed: false,
      },
    ])

    const addTask = () => {
      const item = {
        id: currentID,
        title: '',
        created: new Date(),
        due: new Date(),
        spent: '0h 0m',
        estimate: '0h 0m',
        completed: false,
      }

      tasks.value.push(item)
    }

    const removeTask = (item: any) => {
      const index = tasks.value.indexOf(item)
      if (index > -1) {
        tasks.value.splice(index, 1)
      }
    }

    return {
      tasks,
      doing,
      addTask,
      removeTask,
    }
  },
})
</script>
