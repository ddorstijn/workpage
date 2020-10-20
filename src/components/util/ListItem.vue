<template>
  <div class="item-container">
		<span class="material-icons self-center text-gray cursor-move">
			drag_indicator
		</span>
    <div v-if="icon" class="item-icon">
      <img class="h-8 w-8 rounded-full" :src="icon" alt="icon" />
    </div>
    <div class="item-body">
      <wp-editable
				v-model="titleVal"
        class="text-lg leading-4"
        placeholder="Title"
      />
      <wp-editable
				v-if="detailsEditable"
				v-model="detailsVal"
        class="leading-4 text-xs text-gray"
        placeholder="Details"
      />
			<span v-else class="leading-4 text-xs text-gray">
				{{ details }}
			</span>
    </div>
    <button
      class="material-icons px-2 text-base text-light-darkest hover:text-red"
      @click="$emit('remove')"
    >
      close
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
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
			set: (val: String) => emit('update:title', val)
		})


		const detailsVal = computed({ 
			get: () => props.details, 
			set: (val: String) => emit('update:details', val)
		}) 

    return {
			titleVal,
			detailsVal,
    }
  },
})
</script>

<style lang="postcss" scoped>
.item-container {
  @apply flex items-stretch min-h-12 bg-dark border-gray-lighter shadow cursor-pointer;
}

.item-icon {
  @apply flex justify-center items-center w-12 min-h-12;
}

.item-body {
  @apply flex flex-col justify-center flex-grow mx-2 py-2;
}
</style>
