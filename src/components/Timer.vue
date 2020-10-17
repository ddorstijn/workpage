<template>
  <article class="my-2 h-full">
    <transition name="slide-left">
      <section
        v-if="expanded"
        class="relative mx-3 transition-all duration-500 ease-in-out"
      >
        <div class="relative flex gap-2 justify-center bg-dark-darker p-6 mb-1">
          <svg class="flex-1" viewBox="0 0 500 500">
            <circle
              :stroke-dashoffset="circle.offset"
              :stroke-dasharray="circle.circumference"
              r="240"
              cy="250"
              cx="250"
              fill="none"
              stroke="white"
              stroke-width="4px"
              stroke-linecap="round"
            />
          </svg>
          <div
            class="absolute flex flex-col h-full items-center justify-center"
          >
            <span class="">{{ elapsedHuman }}</span>
            <span class="">
              <template v-if="!currentSession.start">
                <button class="material-icons" @click="startSession">
                  play_arrow
                </button>
              </template>
              <template v-else>
                <button class="material-icons" @click="stopSession">
                  stop
                </button>
              </template>
            </span>
          </div>
        </div>

        <div class="flex gap-2 justify-center bg-dark-darker p-2 mb-2">
          <span>Goal:</span>

          <label for="goal-hours">
            <input
              v-model="goal.hours"
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
              v-model="goal.minutes"
              class="bg-dark w-8 px-2 font-sans text-center rounded focus:outline-none focus:shadow-outline"
              type="number"
              min="0"
              max="60"
              maxlength="2"
            />
            m
          </label>
        </div>
        <div />
      </section>
    </transition>

    <header
      class="collapsible-header"
      :class="{ open: expanded }"
      @click="expanded = !expanded"
    >
      <h2 class="text-3xl">Timer</h2>
      <button class="material-icons ml-auto text-2xl text-light-darkest">
        chevron_right
      </button>
    </header>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue'
import useTimer from '/src/modules/timer'

export default defineComponent({
  setup() {
    const expanded = ref(false)

    const {
      currentSession,
      elapsedTime,
      elapsedHuman,
      startSession,
      stopSession,
    } = useTimer()

    const goal = ref({
      hours: 0,
      minutes: 0,
      timestamp: computed(() => {
        return goal.value.hours * 3600000 + goal.value.minutes * 60000
      }),
    })

    const circle = reactive({
      circumference: 2 * Math.PI * 250,
      offset: computed(() => {
        if (!elapsedTime.value || elapsedTime.value > goal.value.timestamp) {
          return 0
        }

        const step = circle.circumference / goal.value.timestamp
        return circle.circumference - elapsedTime.value * step
      }),
      state: 'alert',
    })

    return {
      expanded,
      goal,
      circle,
      elapsedHuman,
      currentSession,
      startSession,
      stopSession,
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
