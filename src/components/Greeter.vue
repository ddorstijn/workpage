<template>
  <article class="flex flex-col justify-center items-center w-full h-full">
    <h1 class="text-center text-6xl my-4">
      <span>Welcome back, </span>
      <div class="group relative w-content inline-flex">
        <wp-editable
          ref="nameRef"
          :editing="editing"
          placeholder="Name"
          @blur="editing = false"
        >
          {{ name }}
        </wp-editable>
        <button
          class="absolute left-100 top-0 h-full flex items-center invisible group-hover:visible text-dark-darkest bg-light-lightest rounded-r"
          @click="startEdit"
        >
          <span class="material-icons">create</span>
        </button>
      </div>
    </h1>
    <q class="text-center text-xl italic">{{ message }}</q>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from 'vue'
import Editable from './util/Editable.vue'

export default defineComponent({
  components: {
    'wp-editable': Editable,
  },
  setup() {
    const nameRef = ref()
    const editing = ref(false)
    const name = ref('Danny')
    const message = ref('Go beyond yourself rather than beyond others.')

    const startEdit = () => {
      editing.value = true
      nextTick(() => {
        nameRef.value?.focus()
      })
    }

    return {
      nameRef,
      name,
      message,
      editing,
      startEdit,
    }
  },
})
</script>
