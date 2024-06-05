import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const state = ref(0)
    const incrument = () => {
      state.value++
    }
    return {
      state,
      incrument,
    }
  },
  { persist: true }
)
