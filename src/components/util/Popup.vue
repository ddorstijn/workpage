<template>
  <div> 
    <button ref="button" aria-describedby="tooltip">
      <slot></slot>
    </button>
    <div v-if="show" ref="tooltip" role="tooltip">
      <button
        v-if="closeButton"
        type="button"
        @click="show = false"
      >
        <svg class="h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <slot id="tooltip" name="tooltip"></slot>
      <div id="arrow" data-popper-arrow></div>
    </div>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    closeButton: { type: Boolean, default: false },
  },
  data() {
    return {
      show: true,
    }
  },
  mounted() {
    console.log(this.$refs.button)
    createPopper(this.$refs.button, this.$refs.tooltip, {

      onFirstUpdate: state => console.log('Popper positioned on', state.placement),
    });
  },
  beforeUnmount() {
    
  }
})
</script>

<style lang="postcss" scoped>
#arrow,
#arrow::before {
  position: absolute;
  width: 8px;
  height: 8px;
  z-index: -1;
}

#arrow::before {
  content: '';
  transform: rotate(45deg);
  @apply bg-light-lighter
}

#tooltip[data-popper-placement^='top'] > #arrow {
  bottom: -4px;
}

#tooltip[data-popper-placement^='bottom'] > #arrow {
  top: -4px;
}

#tooltip[data-popper-placement^='left'] > #arrow {
  right: -4px;
}

#tooltip[data-popper-placement^='right'] > #arrow {
  left: -4px;
}

#tooltip {
  /* ... */
  display: none;
}

#tooltip[data-show] {
  display: block;
}
</style>