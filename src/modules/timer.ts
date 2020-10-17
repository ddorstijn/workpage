import { ref, computed, onUnmounted } from 'vue'

interface Session {
  start: number
  end: number
}

export default function useTimer() {
  const intervalHandle = ref()
  const previousSessions = ref([] as Session[])
  const currentSession = ref({} as Session)

  const elapsedTime = computed(() => {
    let total = 0
    previousSessions.value.forEach((session: Session) => {
      total += session.end - session.start
    })

    if (currentSession.value) {
      total += currentSession.value.end - currentSession.value.start
    }

    return total
  })

  const elapsedHuman = computed(() => {
    const date = new Date(elapsedTime.value)
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const seconds = date.getUTCSeconds()
    return `${hours}h ${minutes}m ${seconds}s`
  })

  // Methods
  const updateTimer = () => {
    if (currentSession.value.start) {
      currentSession.value.end = Date.now()
      return
    }

    currentSession.value.end = 0
  }

  const startSession = () => {
    currentSession.value.start = Date.now()
  }

  const stopSession = () => {
    const session = {
      start: currentSession.value.start,
      end: Date.now(),
    } as Session

    previousSessions.value.push(session)
    currentSession.value.start = 0
  }

  // Lifecycle hooks
  intervalHandle.value = setInterval(updateTimer, 500)
  onUnmounted(() => {
    clearInterval(intervalHandle.value)
  })

  return {
    intervalHandle,
    currentSession,
    previousSessions,
    elapsedTime,
    elapsedHuman,
    updateTimer,
    startSession,
    stopSession,
  }
}
