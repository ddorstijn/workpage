<template>
  <article class="flex flex-col justify-center items-center w-full h-full">
    <h1 class="flex items-baseline text-center text-6xl my-4">
      <span class="whitespace-pre">Welcome back, </span>
      <wp-editable v-model="username" placeholder="Name" :oneliner="true" />
    </h1>
    <q class="text-center text-xl italic">{{ message }}</q>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Editable from './util/Editable.vue'

export default defineComponent({
  components: {
    'wp-editable': Editable,
  },
  setup() {
    const username = ref('Danny')
    const message = ref('Go beyond yourself rather than beyond others.')

    return {
      username,
      message,
    }
  },
})
</script>
