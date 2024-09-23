import Service, { PromiseResponse } from '@/apis'
type UserInfo = {
  id: number
  group_id: number
  class_id: number
  username: string
  nickname: string
}
type GroupInfo = {
  id: number
  group_name: string
  group_description: string
  group_code: string
  group_color: string
}
export type { UserInfo, GroupInfo }
/**
 * 通用接口
 */
export default class CommonAPI {
  static async queryStudentsByGroupId(params: {
    group_id: number
  }): PromiseResponse<{
    list: UserInfo[]
  }> {
    return Service({
      url: '/group/all_member',
      method: 'get',
      params,
    })
  }

  static async queryGroupsByClassId(params: {
    class_id: number
  }): PromiseResponse<{
    list: GroupInfo[]
  }> {
    return Service({
      url: '/group/all',
      method: 'get',
      params,
    })
  }
}
