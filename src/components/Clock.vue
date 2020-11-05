<template>
  <article class="flex flex-col items-center justify-center">
    <h1 class="text-7xl text-center">
      {{ time }}
    </h1>
    <h3 class="text-2xl text-center">
      {{ date }}
    </h3>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const date = ref()
    const time = ref()

    const getTimeAndDate = () => {
      const d = new Date()
      const dateOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }

      const timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
      }

      date.value = new Intl.DateTimeFormat('en-GB', dateOptions).format(d)
      time.value = new Intl.DateTimeFormat('en-GB', timeOptions).format(d)

      setTimeout(() => {
        getTimeAndDate()
      }, 5000)
    }

    getTimeAndDate()

    return {
      date,
      time,
    }
  },
})
</script>
