<template>
  <main class="area area-main">
    <wp-clock />
    <wp-projects />
    <wp-links />
  </main>
  <div id="vert-sep" class="bg-dark-lighter h-auto" />
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
    'main sep tasks' 1fr
    'main sep timer' min-content / 2fr min-content 1fr;

  background: radial-gradient(#3c3836 0%, #282828 70%);
  @apply text-light-lighter font-sans gap-16 p-16;
}

.area {
  @apply flex flex-col items-center justify-center flex-grow;
}

.area-main {
  grid-area: main;
}

#vert-sep {
  grid-area: sep;
  width: 1px;
}

.area-tasks {
  grid-area: tasks;
}

.area-timer {
  grid-area: timer;
}
</style>
