import Service from '@/apis'
import { Response } from '@/apis'
interface Login {
  username: string
  password: string
}

interface LoginResult {
  token: string
  username: string
  nickname: string
  id: number
}

export type { Login, LoginResult }

const URL = 'auth'

class AuthAPI {
  static login(params: Login): Promise<Response<LoginResult>> {
    return Service({
      method: 'post',
      url: `${URL}/login`,
      data: params,
    })
  }
}

export default AuthAPI
