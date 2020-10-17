<template>
  <section id="area-tl">
    <wp-clock />
  </section>
  <section id="area-tc">
    <wp-projects />
  </section>
  <section id="area-cc">
    <wp-greeter />
  </section>
  <section id="area-bl" />
  <section id="area-bc">
    <wp-links />
  </section>
  <section
    id="sidebar"
    class="flex flex-col justify-between gap-4 h-screen w-full"
  >
    <section id="area-tr">
      <wp-tasks />
    </section>
    <section id="area-br">
      <wp-timer />
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Clock from './components/Clock.vue'
import Greeter from './components/Greeter.vue'
import Links from './components/Links.vue'
import Projects from './components/Projects.vue'
import Tasks from './components/Tasks.vue'
import Timer from './components/Timer.vue'

export default defineComponent({
  name: 'App',
  components: {
    'wp-clock': Clock,
    'wp-greeter': Greeter,
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
  display: grid;
  grid-template-areas:
    'tl tc sr'
    'tl cc sr'
    'bl cc sr'
    'bl bc sr';
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: 2fr 1fr 1fr 2fr;
  gap: 0.75rem;
}

#area-tl {
  grid-area: tl;
  position: relative;
  overflow: hidden;
}

#area-tc {
  grid-area: tc;
  position: relative;
  overflow: hidden;
}

#area-cc {
  grid-area: cc;
  position: relative;
  overflow: hidden;
}

#area-bl {
  grid-area: bl;
  position: relative;
  overflow: hidden;
}

#area-bc {
  grid-area: bc;
  position: relative;
  overflow: hidden;
}

#area-tr {
  grid-area: tr;
  position: relative;
  overflow: hidden;
}

#area-br {
  grid-area: br;
  position: relative;
  overflow: hidden;
}

#sidebar {
  grid-area: sr;
}
</style>
