<template>
  <article class="my-2 h-full">
    <transition name="slide-left">
      <div v-if="expanded" class="collapsible-body">
        <section
          class="relative flex w-full h-full gap-2 justify-center bg-dark-darker p-6 px-12 mb-1"
        >
          <svg ref="dialRef" class="dial" viewBox="0 0 100 100">
            <g transform="rotate(45, 50, 50)" stroke-width="5" fill="none">
              <path
                stroke="#928374"
                stroke-linecap="round"
                d="M100,50 a47.5,47.5 0 1,0 -50,50"
              />
              <path
								:class="['stroke-current', dial.color]"
                stroke-linecap="round"
                :stroke-dasharray="dial.length"
                :stroke-dashoffset="dial.offset"
                d="M100,50 a47.5,47.5 0 1,0 -50,50"
              />
            </g>
          </svg>
          <div
            class="absolute self-center flex flex-col items-center justify-center mt-6"
          >
            <span class="text-xl">{{ elapsedHuman }}</span>
            <template v-if="!currentSession.start">
              <button class="material-icons text-2xl" @click="startSession">
                play_arrow
              </button>
            </template>
            <template v-else>
              <button class="material-icons text-2xl" @click="stopSession">
                stop
              </button>
            </template>
          </div>
        </section>

        <section class="flex gap-2 justify-center bg-dark-darker p-2 mb-2">
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
    </transition>

    <header
      class="collapsible-header"
      :class="{ open: expanded }"
      @click="expanded = !expanded"
    >
      <h2 class="text-3xl">
        <span class="material-icons m-1">alarm</span>
        Timer
      </h2>
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
      previousSessions,
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
				console.log(percentage)
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
      goal,
      dial,
      elapsedHuman,
      previousSessions,
      currentSession,
      startSession,
      stopSession,
    }
  },
})
</script>

<style lang="postcss" scoped>
.collapsible-header {
  @apply relative left-100 flex justify-start items-center py-3 mb-2 cursor-pointer select-none bg-dark shadow-xl transition-all duration-500 ease-in-out;
}

.collapsible-header > h2 {
  @apply transform -translate-x-full px-8 transition-all duration-500 ease-in-out;
}

.collapsible-header:hover {
  @apply left-80;
}

.collapsible-header:hover > h2 {
  @apply transform -translate-x-1/2;
}

.collapsible-header.open {
  @apply left-0 pl-8 pr-3 mx-2 bg-dark shadow-xl;
}

.collapsible-header.open > h2 {
  @apply transform translate-x-0 px-0;
}

.collapsible-body {
  @apply relative block mx-2 transition-all duration-500 ease-in-out;
}

.slide-left-enter-to,
.slide-left-leave-from {
  @apply left-0;
}

.slide-left-enter-from,
.slide-left-leave-to {
  @apply left-100;
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
