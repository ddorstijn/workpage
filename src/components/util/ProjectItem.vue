<template>
  <li
    class="flex justify-between w-full group hover:bg-dark-lighter py-2 pl-4 rounded"
  >
    <div class="w-full flex flex-col">
      <textarea
        v-model="titleVal"
        class="font-sans tracking-wide text-md bg-transparent resize-none"
				ref="title"
        rows="1"
        readonly
				onclick="this.readOnly = false"
        onblur="this.readOnly = true"
				@input="resize"
        @keydown.escape="$event.target.blur()"
        @keydown.enter.prevent="$event.target.blur()"
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
          <p>{{ due.toLocaleString('en-gb', { month: 'short', day: 'numeric' }) }}</p>
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
          <p>{{ spent }} / {{ estimate }}</p>
        </div>
      </div>
    </div>
    <div class="flex items-center invisible group-hover:visible">
      <button
        class="pl-2 pr-4 text-base text-light-darkest hover:text-red"
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
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: { type: String, required: true },
    created: { type: Date, required: true },
    due: { type: Date, required: true },
    spent: { type: String, required: true },
    estimate: { type: String, required: true },
  },
  emits: ['remove', 'update:title'],
  computed: {
    titleVal: {
      get(): string { 
        return this.title
      },
      set(val: string) { 
        this.$emit('update:title', val) 
      }
    }
  },
	mounted() {
		this.resize();
	},
	methods: {
		resize() {
			this.$refs.title.style.height = `${this.$refs.title.scrollHeight}px`
		}
	}
})
</script>
