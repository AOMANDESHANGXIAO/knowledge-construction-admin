export function useVisible() {

  const visible = ref(false)

  const toggleVisible = () => {
    visible.value = !visible.value
  }

  const setVisible = (value: boolean) => {
    visible.value = value
  }
  return {
    visible,
    toggleVisible,
    setVisible
  }
}
