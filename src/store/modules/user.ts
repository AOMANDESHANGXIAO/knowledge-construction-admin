import { defineStore } from 'pinia'

interface UserInfoParams {
  access_token: string
  username: string
}

export const useUserStore = defineStore(
  'st-admin-user',
  () => {
    const access_token = ref<string>('')
    const username = ref<string>('')

    const setUserInfo = (params: UserInfoParams) => {
      access_token.value = params.access_token
      username.value = params.username
    }

    return {
      access_token,
      username,
      setUserInfo,
    }
  },
  { persist: true }
)
