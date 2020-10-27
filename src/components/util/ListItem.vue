<template>
  <div class="p-2 rounded-lg flex justify-between w-full group">
    <div class="flex items-center">
			<div class="h-5 invisible group-hover:visible">
				<slot name="icon" />
			</div>

      <div class="mx-3 w-11/12">
        <wp-editable
          v-model="titleVal"
          class="font-sans tracking-wide text-md"
          placeholder="Title"
        />
        <template v-if="details">
          <wp-editable
            v-if="detailsEditable"
            v-model="detailsVal"
            class="text-gray text-sm"
            placeholder="Details"
          />
          <p v-else class="leading-4 text-xs text-gray">
            {{ details }}
          </p>
        </template>
      </div>
    </div>
    <div class="flex items-center invisible group-hover:visible">
      <button class="px-2 text-base text-light-darkest hover:text-yellow">
        <svg
          class="h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <button
        class="px-2 text-base text-light-darkest hover:text-red"
        @click="$emit('remove')"
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
