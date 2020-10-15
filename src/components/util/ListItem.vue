<template>
  <div class="flex items-stetch h-12 bg-dark border-gray-lighter rounder-r shadow">
    <div v-if="icon" class="flex justify-center items-center w-12 h-12 bg-dark-darkest">
      <img class="h-8 w-8 rounded-full" :src="icon" alt="icon" />
    </div>
    <div class="flex flex-col justify-center mx-2">
      <wp-editable ref="titleRef" v-model:editing="editing" class="leading-4" placeholder="Title">
        {{ title }}
      </wp-editable>
      <wp-editable class="leading-3 text-xs text-gray" :editing="editing && detailsEditable" placeholder="Details">
        {{ details }}
      </wp-editable>
    </div>
    <div class="flex items-center gap-2 p-2 ml-auto bg-light text-dark rounded-r">
      <button class="material-icons text-base" @click="startEdit">create</button>
      <button class="material-icons text-base" @click="$emit('remove')">delete</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from 'vue'
import Editable from './Editable.vue'

export default defineComponent({
  components: {
    'wp-editable': Editable,
  },
  emits: ['remove'],
  props: {
    title: { type: String, required: true },
    details: { type: String, required: true },
    detailsEditable: { type: Boolean, default: false },
    icon: { type: String, default: '' },
  },
  setup() {
    const titleRef = ref()
    const editing = ref(false)
    const startEdit = () => {
      editing.value = true
      nextTick(() => {
        titleRef.value!.focus()
      })
    }

    return {
      editing,
      startEdit,
      titleRef,
    }
  },
})
</script>
