export function useControl() {
  const control = ref(false)

  const setControl = (value: boolean) => {
    control.value = value
  }

  const toggleControl = () => {
    control.value = !control.value
  }
  return {
    control,
    setControl,
    toggleControl,
  }
}
