import type { Response } from '@/apis/'
import _ from 'lodash'
import { ref } from 'vue'

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
  throttle,
  notify,
  defaultNotify,
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
  defaultNotify?: boolean
  notify?: {
    successMsg?: string
    failMsg?: string
    errorMsg?: string
  }
}) {
  const loading = ref(false)
  const DEFAULT_NOTE_MSG = {
    success: '操作成功',
    fail: '操作失败',
    error: '操作异常',
  }

  const excute = async () => {
    try {
      loading.value = true
      const res = await apiFn()
      // const data = res.data
      if (res.success) {
        onSuccess && onSuccess(res.data)
        // 成功时提示
        if ((notify && notify.successMsg) || defaultNotify) {
          ElNotification({
            title: '成功',
            message: notify?.successMsg || DEFAULT_NOTE_MSG.success,
            type: 'success',
          })
        }
        formatter && formatter(res.data)
      } else {
        // 失败时提示
        if ((notify && notify.failMsg) || defaultNotify) {
          ElNotification({
            title: '失败',
            message: notify?.failMsg || DEFAULT_NOTE_MSG.fail,
            type: 'error',
          })
        }
        onFailure && onFailure()
      }
    } catch {
      if ((notify && notify.errorMsg) || defaultNotify) {
        ElNotification({
          title: '错误',
          message: notify?.errorMsg || DEFAULT_NOTE_MSG.error,
          type: 'error',
        })
      }
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
