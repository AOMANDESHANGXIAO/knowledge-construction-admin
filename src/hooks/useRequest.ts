import type { Response } from "@/apis/"
import _ from "lodash"
import { ref } from "vue"

/**
 *
 * @param {Object} options
 * @returns
 * @description 封装请求，支持防抖和节流
 */
function useRequest<T = any, D = any>({
  apiFn,
  onSuccess,
  onFailure,
  onError,
  onFinally,
  formatter,
  immediate,
  debounce,
  throttle
}: {
  apiFn: (...args: any) => Promise<Response<T>>
  onSuccess?: (res: T) => void
  onFailure?: () => void
  onError?: () => void
  onFinally?: () => void
  formatter?: (res: T) => D
  immediate?: boolean
  debounce?: number
  throttle?: number
}) {
  const loading = ref(false)

  const excute = async () => {
    try {
      loading.value = true
      const res = await apiFn()
      // const data = res.data
      if (res.success) {
        onSuccess && onSuccess(res.data)
        formatter && formatter(res.data)
      } else {
        onFailure && onFailure()
      }
    } catch {
      onError && onError()
    } finally {
      loading.value = false
      onFinally && onFinally()
    }
  }

  let run = excute

  if (immediate) {
    excute()
  }

  if (debounce) {
    run = _.debounce(excute, debounce) as any
  }

  if (throttle) {
    run = _.throttle(excute, throttle) as any
  }

  return { loading, run }
}

export default useRequest
