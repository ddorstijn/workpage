<template>
  <span
    ref="inputRef"
    id="input"
    :contenteditable="editing"
    class="pl-2 pr-4 border-b-2 rounded border-transparent"
    :class="{ 'border-light-lightest': editing, 'bg-dark-darker': editing }"
    @keydown.enter.prevent="blur"
    @keydown.esc="blur"
  >
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  emits: ['update:editing'],
  props: {
    editing: { type: Boolean, required: true },
  },
  setup() {
    const inputRef = ref()
    const focus = () => {
      inputRef.value.focus()
      document.execCommand('selectAll', false, undefined)
    }

    const blur = () => {
      inputRef.value.blur()
    }

    return {
      inputRef,
      focus,
      blur,
    }
  },
})
</script>

<style lang="postcss" scoped>
#input:empty:before {
  content: attr(placeholder);
  @apply text-light-darkest;
}
</style>
