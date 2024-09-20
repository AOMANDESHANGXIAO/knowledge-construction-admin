import { ref, UnwrapRef, Ref } from 'vue'

/**
 *
 * @param initialValue
 * @returns
 * @description 这是一个仿React风格的管理state hook，在此基础上我们扩展了功能，使其可以记录上一次的state
 */
function useState<T>(
  initialValue: T
): [Ref<UnwrapRef<T>>, (newValue: UnwrapRef<T>) => void, Ref<UnwrapRef<T>>] {
  const state = ref<T>(initialValue)
  const previousState = ref<T>(initialValue)

  function setState(newValue: UnwrapRef<T>): void {
    previousState.value = state.value
    state.value = newValue
  }

  return [state, setState, previousState]
}
export default useState
