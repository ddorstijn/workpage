<template>
  <main class="my-auto w-4/6">
    <wp-clock />
    <wp-projects />
    <wp-links />
  </main>
  <aside class="w-2/6 h-full flex flex-col gap-6 justify-between">
    <wp-tasks />
    <wp-timer />
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Clock from './components/Clock.vue'
import Links from './components/Links.vue'
import Projects from './components/Projects.vue'
import Tasks from './components/Tasks.vue'
import Timer from './components/Timer.vue'

export default defineComponent({
  name: 'App',
  components: {
    'wp-clock': Clock,
    'wp-links': Links,
    'wp-projects': Projects,
    'wp-tasks': Tasks,
    'wp-timer': Timer,
  },
})
</script>

<style lang="postcss">
* {
  box-sizing: border-box;
}

#app {
  width: 100vw;
  height: 100vh;

  background: radial-gradient(#3c3836 0%, #282828 70%);
  @apply flex gap-32 p-16 text-light-lighter font-sans;
}
</style>
