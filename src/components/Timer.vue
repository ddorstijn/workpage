<template>
  <article class="container gap-x-4 gap-y-2">
    <header
      id="header"
      class="flex justify-center items-center cursor-pointer select-none"
    >
      <svg
        class="h-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clip-rule="evenodd"
        />
      </svg>
    </header>
    <section id="status" class="flex flex-col">
      <h3 class="text-xl">{{ elapsedHuman }}</h3>
      <h4 class="text-sm">Session: 0h 12m 36s</h4>
    </section>
    <section id="goal" class="flex justify-end items-center gap-1 px-2 mt-auto">
      <svg
        class="w-4 text-light-darker"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
          clip-rule="evenodd"
        />
      </svg>
      <h5 class="text-sm text-center">0h 30m</h5>
    </section>
    <svg
      id="bar"
      class="w-full h-1"
      viewBox="0 0 100 2"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        class="stroke-current text-dark"
        x1="1"
        y1="1"
        x2="99"
        y2="1"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        class="stroke-current text-light"
        x1="1"
        y1="1"
        x2="19"
        y2="1"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue'
import useTimer from '/src/modules/timer'

export default defineComponent({
  setup() {
    const playpauseRef = ref()
    const pauseplayRef = ref()

    const {
      previousSessions,
      currentSession,
      elapsedTime,
      elapsedHuman,
      startSession,
      stopSession,
    } = useTimer()

    const toggleTimer = () => {
      if (!currentSession.value.start) {
        playpauseRef.value.beginElement()
        startSession()
      } else {
        pauseplayRef.value.beginElement()
        stopSession()
      }
    }

    const goal = ref({
      hours: 0,
      minutes: 0,
      timestamp: computed(() => {
        return goal.value.hours * 3600000 + goal.value.minutes * 60000
      }),
    })

    const dial = reactive({
      length: 2 * Math.PI * 50 * 0.75,
      offset: computed(() => {
        if (!elapsedTime.value || elapsedTime.value > goal.value.timestamp) {
          return 0
        }

        const step = dial.length / goal.value.timestamp
        return -dial.length + elapsedTime.value * step
      }),
      color: computed(() => {
        const percentage = 1 - Math.abs(dial.offset) / dial.length
        if (percentage < 0.25) {
          return 'text-red'
        } else if (percentage < 0.75) {
          return 'text-yellow'
        }

        return 'text-green'
      }),
    })

    return {
      playpauseRef,
      pauseplayRef,
      goal,
      dial,
      elapsedHuman,
      previousSessions,
      currentSession,
      startSession,
      stopSession,
      toggleTimer,
    }
  },
})
</script>

<style lang="postcss" scoped>
.container {
  display: grid;
  grid-template:
    'header status goal' 1fr
    'header bar    bar ' min-content / min-content 3fr 1fr;
}

#header {
  grid-area: header;
}

#status {
  grid-area: status;
}

#goal {
  grid-area: goal;
}

#bar {
  grid-area: bar;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
