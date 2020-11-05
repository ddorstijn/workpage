<template>
  <article
    class="grid gap-x-4 gap-y-1"
    style="
          grid-template-rows: 1fr min-content;
          grid-template-columns: min-content 2fr 1fr;
        "
  >
    <header
      class="row-span-2 flex justify-center items-center cursor-pointer select-none"
    >
      <svg
        class="h-10 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clip-rule="evenodd"
        />
      </svg>
    </header>
    <section class="flex flex-col">
      <h3
        class="text-xl"
        v-text="timeToHuman(elapsed)"
      />
      <h4 class="text-sm">
        session:
        <span
          v-text="timeToHuman(sessions[0].end - sessions[0].start)"
        />
      </h4>
    </section>
    <section class="flex flex-col items-end gap-1 px-2 mt-auto">
      <template v-if="!running">
        <button
          class="flex items-center gap-1 px-1 rounded bg-light-lighter text-dark-darker"
          @click="startSession()"
        >
          <svg
            class="h-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clip-rule="evenodd"
            />
          </svg>
          Start
        </button>
      </template>
      <template v-if="running">
        <button
          class="flex items-center gap-1 px-1 rounded bg-light-lighter text-dark-darker"
          @click="endSession()"
        >
          <svg
            class="h-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clip-rule="evenodd"
            />
          </svg>
          Stop
        </button>
      </template>
      <div class="relative">
        <form
          v-if="open"
          class="absolute w-32 -ml-16 p-2 rounded shadow-xl bg-dark-lighter left-50 bottom-100 flex flex-col gap-2"
        >
          <label class="text-xs">
            Hours:
            <input
              v-model="goal.hours"
              type="number"
              class="w-full mt-1 p-1 rounded text-sm bg-dark text-light-lighter"
            />
          </label>
          <label class="text-xs">
            Minutes:
            <input
              v-model="goal.minutes"
              type="number"
              class="w-full mt-1 p-1 rounded text-sm bg-dark text-light-lighter"
            />
          </label>
        </form>
        <button
          class="inline-block"
          @click="open = !open"
        >
          goal:
          <h5
            class="inline text-sm text-center"
            v-text="`${goal.hours}h ${goal.minutes}m`"
          />
        </button>
      </div>
    </section>
    <svg
      class="col-span-2 w-full h-1"
      viewBox="-1 0 102 2"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        class="stroke-current text-dark"
        x1="0"
        y1="1"
        x2="100"
        y2="1"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        class="stroke-current text-light"
        x1="0"
        y1="1"
        :x2="progress"
        y2="1"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      open: false,
      running: false,
      goal: { hours: 1, minutes: 30 },
      sessions: [{ start: 0, end: 0 }],
    }
  },
  computed: {
    elapsed() {
      return this.sessions.reduce((accumulator: number, session: number) => {
        return accumulator + session.end - session.start;
      }, 0)
    },
    goalTime() {
      return this.goal.hours * 360000 + this.goal.minutes * 60000;
    },
    progress() {
      return Math.min(100, (100 * this.elapsed) / this.goalTime);
    },
  },
  methods: {
    startSession() {
      const now = Date.now();
      this.running = true;
      this.sessions[0] = { start: now, end: now };
      this.update();
    },
    endSession() {
      this.running = false;
      this.sessions.unshift({ start: 0, end: 0 });
    },
    update() {
      if (!this.running) return;

      this.sessions[0].end = Date.now();
      setTimeout(() => {
        this.update();
      }, 1000)
    },
    timeToHuman(time: number) {
      const date = new Date(time);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const seconds = date.getUTCSeconds();
      return `${hours}h ${minutes}m ${seconds}s`;
    },
  }
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
