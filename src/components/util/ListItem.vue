<template>
  <div class="bg-dark shadow-lg p-2 rounded-lg flex justify-between w-full">
    <div class="flex items-center">
      <img v-if="icon" class="w-10 h-10 rounded-full" :src="icon" alt="icon" />
      <div class="ml-3">
        <wp-editable
          v-model="titleVal"
          class="font-sans tracking-wide text-md"
          placeholder="Title"
        />
        <wp-editable
          v-if="detailsEditable"
          v-model="detailsVal"
          class="text-gray text-sm"
          placeholder="Details"
        />
        <p v-else class="leading-4 text-xs text-gray">
          {{ details }}
        </p>
      </div>
    </div>
    <div class="flex items-center">
      <button
        class="px-2 text-base text-light-darkest hover:text-red"
        @click="$emit('remove')"
      >
				<svg class="h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import Editable from './Editable.vue'

export default defineComponent({
  components: {
    'wp-editable': Editable,
  },
  emits: ['remove', 'update:title', 'update:details'],
  props: {
    title: { type: String, required: true },
    details: { type: String, required: true },
    detailsEditable: { type: Boolean, default: false },
    icon: { type: String, default: '' },
  },
  setup(props, { emit }) {
    const titleVal = computed({
      get: () => props.title,
      set: (val: String) => emit('update:title', val),
    })

    const detailsVal = computed({
      get: () => props.details,
      set: (val: String) => emit('update:details', val),
    })

    return {
      titleVal,
      detailsVal,
    }
  },
})
</script>

<style lang="postcss" scoped></style>
