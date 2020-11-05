<template>
  <a
    ref="inputRef"
    id="input"
    class="cursor-text -mb-1 border-b-2 border-transparent focus:border-light"
    :contenteditable="editing"
    @click="enableEdit"
    @input="text = $event.target.innerText"
    @keydown.escape="$event.target.blur()"
    @keydown.enter="$event.target.blur()"
    v-once
  >
    {{ text }}
  </a>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, nextTick } from 'vue'

export default defineComponent({
  props: {
    modelValue: { type: String, default: '' },
    editing: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'update:editing'],
  setup(props, { emit }) {
    const inputRef = ref()
    const text = computed({
      get: () => props.modelValue,
      set: (val: String) => emit('update:modelValue', val),
    })

    onMounted(() => {
      if (!props.modelValue) {
        enableEdit()
      }
    })

    const enableEdit = () => {
      emit('update:editing', true)
      nextTick(() => {
        inputRef.value.focus()
        console.log(props.editing)
      })
    }

    return {
      inputRef,
      text,
      enableEdit,
    }
  },
})
</script>

<style lang="postcss" scoped>
#input:empty:before {
  content: attr(placeholder);
  @apply text-light-darker;
}
</style>
