<template>
  <main class="area area-main">
    <wp-clock />
    <wp-projects />
    <wp-links />
  </main>
  <aside class="area area-tasks">
    <wp-tasks />
  </aside>
  <aside class="area area-timer">
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
  display: grid;
  grid-template:
    'main tasks' 1fr
    'main timer' min-content / 1.618fr 1fr;
  gap: 0.75rem;

  background: radial-gradient(#3c3836 0%, #282828 70%);
}

.area {
  @apply flex flex-col items-center justify-center flex-grow p-16;
}

.area-main {
  grid-area: main;
}

.area-tasks {
  grid-area: tasks;
}

.area-timer {
  grid-area: timer;
}
</style>
