import { ref } from 'vue'
import store from '@/store'
import { defineStore } from 'pinia'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN'
  const initToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }

  const token = ref<string>(initToken() || '')
  const username = ref<string>('')
  const nickname = ref<string>('')
  const id = ref<number | null>(null) // 管理员id

  const setUserStore = (data: {
    username: string
    token: string
    nickname: string
    id: number
  }) => {
    username.value = data.username
    nickname.value = data.nickname
    token.value = data.token
    id.value = data.id
    setToken()
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
    username.value = ''
    nickname.value = ''
    token.value = ''
    id.value = null
    removeToken()
    router.push('/login')
  }

  return {
    token,
    username,
    nickname,
    setUserStore,
    getToken,
    logOut
  }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
