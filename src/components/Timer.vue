<template>
  <article class="my-2 h-full">

    <transition name="slide-left">
      <div v-if="expanded" class="collapsible-body">
        <section class="relative flex w-full h-full gap-2 justify-center bg-dark-darker p-6 px-12 mb-1">
          <svg class="flex-1" viewBox="0 0 500 500" transform="rotate(-90)">
            <circle
              class="text-dark stroke-current"
              r="240"
              cy="250"
              cx="250"
              fill="none"
              stroke-width="0.5rem"
              stroke-linecap="round"
            />
            <circle
              :class="{
                'text-green': circle.state == 'success',
                'text-blue': circle.state == 'info',
                'text-yellow': circle.state == 'warning',
                'text-red': circle.state == 'alert',
              }"
              class="stroke-current"
              :stroke-dashoffset="circle.offset"
              :stroke-dasharray="circle.circumference"
              r="240"
              cy="250"
              cx="250"
              fill="none"
              stroke-width="1rem"
            />
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
      	</section>
      </div>
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

    const circle = reactive({
      circumference: 2 * Math.PI * 250,
      offset: computed(() => {
        if (!elapsedTime.value || elapsedTime.value > goal.value.timestamp) {
          return 0
        }

        const step = circle.circumference / goal.value.timestamp
        return circle.circumference - elapsedTime.value * step
      }),
      state: computed(() => {
        const percentage = elapsedTime.value / goal.value.timestamp
        if (percentage > 1 || goal.value.timestamp == 0) {
          return 'success'
        }

        if (percentage > 0.25) {
          return 'info'
        }

        if (percentage > 0.1) {
          return 'warning'
        }

        return 'alert'
      }),
    })

    return {
      expanded,
      goal,
      circle,
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
