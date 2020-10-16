<template>
  <div class="item-container">
    <div v-if="icon" class="item-icon">
      <img class="h-8 w-8 rounded-full" :src="icon" alt="icon" />
    </div>
    <div class="item-body">
      <wp-editable
        ref="titleRef"
        :editing="editing"
        class="text-lg leading-4"
        placeholder="Title"
        @input="$emit('update:title', $event.target.innerText)"
        @blur="blur"
      >
        {{ title }}
      </wp-editable>
      <wp-editable
        class="leading-4 text-xs text-gray"
        :editing="editing && detailsEditable"
        placeholder="Details"
        @input="$emit('update:details', $event.target.innerText)"
        @blur="blur"
      >
        {{ details }}
      </wp-editable>
    </div>
    <div class="item-actions">
      <button class="material-icons text-base" @click="startEdit">create</button>
      <button class="material-icons text-base" @click="$emit('remove')">delete</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from 'vue'
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
  setup(props) {
    const titleRef = ref()
    const detailsRef = ref()
    const editing = ref(false)
    const startEdit = () => {
      if (editing.value) {
        return;
      }

      editing.value = true
      nextTick(() => {
        titleRef.value.focus()
      })
    }

    const blur = (ev: FocusEvent) => {
      if (props.detailsEditable) {
        const nextTarget = ev.relatedTarget
        if (nextTarget === titleRef.value || nextTarget === detailsRef.value) {
          return
        }
      }

      editing.value = false
    }

    onMounted(() => {
      if (!props.title) {
        startEdit()
      }
    });

    return {
      editing,
      startEdit,
      titleRef,
      detailsRef,
      blur,
    }
  },
})
</script>

<style lang="postcss" scoped>
.item-container {
  @apply flex items-stretch min-h-12 bg-dark border-gray-lighter rounded-r shadow cursor-pointer;
}

.item-icon {
  @apply flex justify-center items-center w-12 min-h-12 bg-dark-darkest;
}

.item-body {
  @apply flex flex-col justify-center flex-grow mx-2 py-2;
}

.item-actions {
  @apply flex items-center gap-2 p-2 ml-auto bg-light text-dark rounded-r;
}
</style>
