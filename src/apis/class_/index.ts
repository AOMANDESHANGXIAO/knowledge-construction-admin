import Service from '@/apis/index'
import { PromiseResponse } from '@/apis/index'
const URL = `classroom`

type QueryAllResult = {
  list: {
    id: number
    class_name: string
  }[]
}

type QueryStudentByClassIdResult = {
  list: {
    group_id: number
    id: number
    nickname: string
    username: string
    group_name: string
    group_description: string
    group_code: string
  }[]
}

export type { QueryAllResult, QueryStudentByClassIdResult }

class ClassAPI {
  static createClassApi(className: string): PromiseResponse {
    return Service({
      method: 'post',
      url: `${URL}/create`,
      data: {
        className,
      },
    })
  }
  /**
   *
   * @param id 班级id
   */
  static queryStudentsByClassId({
    id,
    page = 1,
    pageSize = 10,
  }: {
    id: number
    page?: number
    pageSize?: number
  }): PromiseResponse<QueryStudentByClassIdResult> {
    return Service({
      method: 'get',
      url: `${URL}/user`,
      params: {
        id,
        page,
        pageSize,
      },
    })
  }

  static deleteClass(id: number): PromiseResponse {
    return Service({
      method: 'delete',
      url: `${URL}/delete`,
      data: {
        id,
      },
    })
  }

  static queryAll(): PromiseResponse<QueryAllResult> {
    return Service({
      method: 'get',
      url: `${URL}/queryClassroomList`,
    })
  }
}
export default ClassAPI
