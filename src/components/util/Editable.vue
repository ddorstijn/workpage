<template>
  <span 
    id="input"
    class="pb-1 border-b-2 border-transparent focus:border-light"
		contenteditable

		:value="text"
    @input="text = $event.target.innerText"
    @keydown.escape="$event.target.blur()"
    @keydown.enter="$event.target.blur()"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
		modelValue: { type: String, required: true },
    oneliner: { type: Boolean, default: false },
  },
	emits: ['update:modelValue'],
  setup(props, { emit }) {
		const text = computed({ 
			get: () => props.modelValue, 
			set: (val: String) => emit('update:modelValue', val)
		}) 

    return {
			text,
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
