import {defineStore} from 'pinia'

interface UserInfoParams {
    access_token: string
    username: string
    id: number | string
}

export const useUserStore = defineStore(
    'st-admin-user',
    () => {
        const access_token = ref<string>('')
        const username = ref<string>('')
        const id = ref<string | number>('')


        const setUserInfo = (params: UserInfoParams) => {
            access_token.value = params.access_token
            username.value = params.username
            id.value = params.id
            console.log('store', params)
        }

        return {
            access_token,
            username,
            id,
            setUserInfo,
        }
    },
    {persist: true}
)
