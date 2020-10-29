<template>
  <div class="flex justify-between w-full group hover:bg-dark-darker">
    <div class="w-full flex flex-col">
      <wp-editable
        v-model="titleVal"
        class="font-sans tracking-wide text-md"
        placeholder="Title"
      />
      <div class="flex gap-2 items-center text-gray text-sm">
        <div class="flex items-center">
          <svg
            class="w-3 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          <p>
            {{
              due.toLocaleString('en-gb', {
                month: 'short',
                day: 'numeric',
              })
            }}
          </p>
        </div>

        <div class="flex items-center">
          <svg
            class="w-3 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clip-rule="evenodd"
            />
          </svg>
          <p>
            <span class="whitespace-pre">{{ spent }}</span> /
            <span>{{ estimate }}</span>
          </p>
        </div>
      </div>
    </div>
    <div v-if="!doing" class="flex items-center invisible group-hover:visible">
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
    created: { type: Date },
    due: { type: Date },
    spent: { type: String },
    estimate: { type: String },
    doing: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const titleVal = computed({
      get: () => props.title,
      set: (val: String) => emit('update:title', val),
    })

    return {
      titleVal,
    }
  },
})
</script>
