import Service, { PromiseResponse } from '@/apis'
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
interface Register {
  username: string
  password: string
  nickname: string
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
  static register(data: Register): PromiseResponse<any> {
    return Service({
      method: 'post',
      url: `${URL}/register`,
      data,
    })
  }
}

export default AuthAPI
