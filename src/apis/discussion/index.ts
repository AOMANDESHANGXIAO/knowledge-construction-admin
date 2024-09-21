import Service, { PromiseResponse } from '@/apis/index'
type CreateDiscussion = {
  topic_content: string
  created_user_id: number
  topic_for_class_id: number
}
const URL = `discuss`

export default class DiscussionAPI {
  /**
   * 创建讨论
   */
  static async create(params: CreateDiscussion): PromiseResponse<any> {
    return Service({
      method: 'post',
      data: params,
      url: `${URL}/create`,
    })
  }
}
