export const useLocalTime = (timeZone: MaybeRefOrGetter<string>) => {
  const time = ref('')
  let timer: ReturnType<typeof setInterval> | undefined

  const tick = () => {
    time.value = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: toValue(timeZone) }).format(new Date())
  }

  onMounted(() => {
    tick()
    timer = setInterval(tick, 15000)
  })

  onUnmounted(() => clearInterval(timer))

  return time
}
