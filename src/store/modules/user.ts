import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"

export const useUserStore = defineStore("user", () => {
  const ACCESS_TOKEN_KEY = "ACCESS_TOKEN"
  const initToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }

  const token = ref<string>(initToken() || "")
  const username = ref<string>("")
  const nickname = ref<string>("")

  const setUserStore = (data: { username: string; token: string; nickname: string }) => {
    username.value = data.username
    nickname.value = data.nickname
    token.value = data.token
    setToken()
  }

  const getToken = () => {
    return token.value
  }

  const setToken = () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token.value)
  }

  return {
    token,
    username,
    nickname,
    setUserStore,
    getToken
  }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
