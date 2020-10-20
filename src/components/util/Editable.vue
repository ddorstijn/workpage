<template>
  <span 
		ref="inputRef"
    id="input"
    class="cursor-text border-b-2 border-transparent focus:border-light"
		contenteditable

    @input="text = $event.target.innerText"
    @keydown.escape="$event.target.blur()"
    @keydown.enter="$event.target.blur()"
		v-once
  >{{ text }}</span>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'

export default defineComponent({
  props: {
		modelValue: { type: String, default: '' },
    oneliner: { type: Boolean, default: false },
  },
	emits: ['update:modelValue'],
  setup(props, { emit }) {
		const inputRef = ref()
		const text = computed({ 
			get: () => props.modelValue, 
			set: (val: String) => emit('update:modelValue', val)
		}) 

		onMounted(() => {
			if (!props.modelValue) {
				inputRef.value.focus()
			}
		})

    return {
			inputRef,
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
