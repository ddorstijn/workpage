<template>
  <article class="m-4 border-2 border-light-darkest rounded-lg shadow-lg">
      <div v-if="expanded">
        <section class="relative flex w-full h-full gap-2 justify-center p-6 px-12 mb-1">
        </section>

        <section class="flex gap-2 justify-center p-2 mb-2">
          <span>Goal:</span>
          <label for="goal-hours">
            <input
              v-model.number="goal.hours"
              class="bg-dark w-8 px-2 font-sans text-center rounded focus:outline-none focus:shadow-outline"
              type="number"
              min="0"
              max="24"
              maxlength="2"
            />
            h
          </label>
          <label for="goal-minutes">
            <input
              v-model.number="goal.minutes"
              class="bg-dark w-8 px-2 font-sans text-center rounded focus:outline-none focus:shadow-outline"
              type="number"
              min="0"
              max="60"
              maxlength="2"
            />
            m
          </label>
        </section>
      </div>

    <header
      class="flex justify-center items-center px-4 py-2 cursor-pointer select-none"
      :class="{ open: expanded }"
      @click="expanded = !expanded"
    >
      <h2 class="text-2xl flex items-center gap-1">
        <svg
          class="h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Timer
      </h2>
    </header>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue'
import useTimer from '/src/modules/timer'

export default defineComponent({
  setup() {
    const expanded = ref(false)
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
      expanded,
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
