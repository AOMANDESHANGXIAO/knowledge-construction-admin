export function useLoading() {
  const loading = ref(false)

  const toggleLoading = () => {
    loading.value = !loading.value
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }
  return {
    loading,
    toggleLoading,
    setLoading
  }
}