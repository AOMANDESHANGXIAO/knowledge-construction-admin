import Service, { PromiseResponse } from '@/apis/index'
export interface AddCourseWorkInput {
  topic_id: number
  content: string
}
const BASE_URL = '/coursework'
export default class CourseWorkAPI {
  static async add(data: AddCourseWorkInput): PromiseResponse<any> {
    return Service({
      method: 'post',
      data,
      url: `${BASE_URL}/add`,
    })
  }
  static async findOne(id: number): PromiseResponse<{ courseWork: string }> {
    return Service({
      method: 'get',
      url: `${BASE_URL}/content`,
      params: {
        topic_id: id,
      },
    })
  }
}
