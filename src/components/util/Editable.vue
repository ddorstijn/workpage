<template>
  <span
    id="input"
    ref="inputRef"
    :contenteditable="editing"
    :placeholder="placeholder"
    class="rounded"
    :class="{ 'bg-dark-darker p-1': editing }"
    @keydown.enter.prevent="blur"
    @keydown.esc="blur"
  >
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    editing: { type: Boolean, required: true },
    placeholder: { type: String, required: true },
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
