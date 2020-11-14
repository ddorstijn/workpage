<template>
  <li
    class="flex justify-between w-full group hover:bg-dark-lighter py-2 pl-4 rounded"
  >
    <div class="w-full flex flex-col">
      <p
        v-if="!editing"
        class="font-sans tracking-wide text-md bg-transparent resize-none"
      >
        {{ title }}
      </p>
      <textarea
        v-else
        v-model="titleVal"
        class="font-sans tracking-wide text-base bg-transparent resize-none"
        ref="title"
        rows="1"
        @input="resize"
        @blur="editing = false"
        @keydown.escape="editing = false"
        @keydown.enter.prevent="editing = false"
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
              due.toLocaleString('en-gb', { month: 'short', day: 'numeric' })
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
          <p>{{ spent }} / {{ estimate }}</p>
        </div>
      </div>
    </div>
    <div class="relative flex items-center invisible group-hover:visible">
      <wp-popup
				ref="popup"
        class="p-1 mr-2 text-base text-light-darkest hover:text-dark-darker"
				placement="left"
      >
        <svg
          class="h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
        <template #tooltip>
          <ul class="py-2 flex">
            <li
              class="flex items-center px-2 cursor-pointer hover:text-blue"
              @click="editing = true; $refs.popup.hide(); $nextTick(() => { $refs.title.focus() });"
            >
              <svg
                class="h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </li>
            <li
              class="flex items-center px-2 cursor-pointer hover:text-red"
              @click="$emit('remove')"
            >
              <svg
                class="h-5"
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
            </li>
          </ul>
        </template>
      </wp-popup>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Popup from './Popup.vue'

export default defineComponent({
  components: {
    'wp-popup': Popup,
  },
  props: {
    title: { type: String, required: true },
    created: { type: Date, required: true },
    due: { type: Date, required: true },
    spent: { type: String, required: true },
    estimate: { type: String, required: true },
  },
  emits: ['remove', 'update:title'],
  data() {
    return {
      editing: false,
    }
  },
  computed: {
    titleVal: {
      get(): string {
        return this.title
      },
      set(val: string) {
        this.$emit('update:title', val)
      },
    },
  },
  mounted() {
    if (!this.title) {
      this.editing = true
      this.$nextTick(() => {
        this.resize()
        this.$refs.title.focus()
      })
    }
  },
  methods: {
    resize() {
			this.$refs.title.style.height = 'auto';
      this.$refs.title.style.height = `${this.$refs.title.scrollHeight}px`
    },
  },
})
</script>
