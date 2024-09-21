import { ref } from 'vue'
import store from '@/store'
import { defineStore } from 'pinia'
import router from '@/router'

export const useUserStore = defineStore(
  'user',
  () => {
    const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN'
    const USER_INFO_KEY = 'USER_INFO'
    const initToken = () => {
      return localStorage.getItem(ACCESS_TOKEN_KEY) || ''
    }
    const initUserInfo = () => {
      const userInfo = localStorage.getItem(USER_INFO_KEY)
      if (userInfo) {
        return JSON.parse(userInfo)
      }
      return {
        username: '',
        nickname: '',
        id: null,
      }
    }
    const removeUserInfo = () => {
      localStorage.removeItem(USER_INFO_KEY)
    }

    const token = ref<string>(initToken())
    const user = ref<{
      username: string
      nickname: string
      id: null | number
    }>(initUserInfo())
    const setUserInfo = () => {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value))
    }

    const setUserStore = (data: {
      username: string
      token: string
      nickname: string
      id: number
    }) => {
      user.value = {
        ...data,
      }
      token.value = data.token
      console.log(user.value)
      setToken()
      setUserInfo()
    }

    const getToken = () => {
      return token.value
    }

    const setToken = () => {
      localStorage.setItem(ACCESS_TOKEN_KEY, token.value)
    }

    const removeToken = () => {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    }

    const logOut = () => {
      removeToken()
      removeUserInfo()
      user.value = initUserInfo()
      token.value = initToken()
      router.push('/login')
    }

    return {
      user,
      token,
      setUserStore,
      getToken,
      logOut,
    }
  },
  {
    persist: true,
  }
)

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
