<template>
  <button
    ref="reference"
    aria-describedby="tooltip"
    v-bind="$attrs"
    @click.stop="show()"
  >
    <slot></slot>
  </button>
  <div
    class="tooltip z-40 rounded shadow-xl"
		:class="[backgroundColor, textColor]"
    ref="popper"
    role="tooltip"
    v-show="showPopper"
  >
    <slot name="tooltip"></slot>
    <div class="arrow" data-popper-arrow></div>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core'

export default {
  props: {
    placement: { type: String, default: 'top' },
		backgroundColor: { type: String, default: 'bg-light-lighter' },
		textColor: { type: String, default: 'text-dark-darker' },
  },
  data() {
    return {
      popperJS: null,
      showPopper: false,
      popperOptions: {
        placement: this.placement,
      },
    }
  },

  methods: {
    show() {
      if (!this.popperJS) {
        this.createPopper()

        this.showPopper = true
        document.addEventListener('click', this.handleDocumentClick)
      }
    },

    hide() {
      this.destroyPopper()
      this.showPopper = false
      document.removeEventListener('click', this.handleDocumentClick)
    },

    createPopper() {
      this.$nextTick(() => {
        if (this.popperJS && this.popperJS.destroy) {
          this.popperJS.destroyPopper()
        }

        this.popperOptions.onCreate = () => {
          this.$emit('created', this)
          this.$nextTick(this.updatePopper)
        }

        this.popperJS = createPopper(
          this.$refs.reference,
          this.$refs.popper,
          this.popperOptions
        )
      })
    },

    destroyPopper() {
      this.showPopper = false

      if (this.popperJS) {
        this.popperJS.destroy()
        this.popperJS = null
      }
    },

    updatePopper() {
      this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper()
    },

    handleDocumentClick(e) {
			if (this.$refs.reference.contains(e.target)) {
				return;
			}

      this.$emit('click-away', this)
      this.hide()
    },
  },

  unmounted() {
    this.destroyPopper()
  },
}
</script>

<style scoped>
.arrow,
.arrow::before {
  position: absolute;
  width: 8px;
  height: 8px;
  z-index: -1;
}

.arrow::before {
  content: '';
  transform: rotate(45deg);
  @apply bg-light-lighter;
}

.tooltip[data-popper-placement^='top'] > .arrow {
  bottom: -4px;
}

.tooltip[data-popper-placement^='bottom'] > .arrow {
  top: -4px;
}

.tooltip[data-popper-placement^='left'] > .arrow {
  right: -4px;
}

.tooltip[data-popper-placement^='right'] > .arrow {
  left: -4px;
}
</style>
