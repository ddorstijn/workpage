<template>
  <section
    id="area-left"
    class="area"
  >
    <wp-projects />
    <wp-links />
  </section>
  <section
    id="area-center"
    class="area"
  >
    <wp-clock />
  </section>
  <section
    id="area-right"
    class="area"
  >
    <wp-tasks />
    <wp-timer />
  </section>
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
  grid-template-areas: 'l c r';
  grid-template-columns: 1fr 3fr 1fr;
  gap: 0.75rem;

	background: radial-gradient(#3c3836 0%, #282828 70%);
}

.area {
	@apply flex flex-col h-full p-2;
}

#area-left {
  grid-area: l;
}

#area-center {
  grid-area: c;
}

#area-right {
  grid-area: r;
}
</style>
