import Service, { PromiseResponse } from '@/apis/index'
type CreateDiscussion = {
  topic_content: string
  created_user_id: number
  topic_for_class_id: number
}
type UpdateDiscussion = {
  topicId: number
  status: 'feedback' | 'summary' | 'close'
  operatorId: number
}
type QueryTopicInput = {
  class_id: number // 班级id
  content?: string // 模糊匹配内容
  sort?: 1 | 0 // 1 降序 0 升序
}
type QueryTopicResult = {
  list: {
    id: number
    topic_content: string
    created_time: Date
    nickname: string
    status: 'feedback' | 'summary' | 'close' | 'propose'
  }[]
}
type QueryRateInput = {
  topicId: number
  groupId?: number
  ideaType?: 'idea' | 'group'
  publisherId?: number
}
type QueryIdeaResult = {
  renderId: number
  id: number
  type: 'idea' | 'group'
  student_id: number
  nickname: string
  created_time: Date
  group_id: number
  group_name: string
  recognition: number
  understanding: number
  evaluation: number
  analysis: number
  create: number
  version: number
  content: string
}
type UpdateRateInput = {
  recognition: number
  understanding: number
  evaluation: number
  analysis: number
  create: number
  node_table_id: number
  version: number
}
export type {
  CreateDiscussion,
  UpdateDiscussion,
  QueryTopicInput,
  QueryTopicResult,
  QueryIdeaResult,
  UpdateRateInput,
}
const URL = `discuss`

export default class DiscussionAPI {
  /**
   * 创建讨论
   */
  static async create(data: CreateDiscussion): PromiseResponse<any> {
    return Service({
      method: 'post',
      data,
      url: `${URL}/create`,
    })
  }

  /**
   * 推进讨论
   */
  static async update(data: UpdateDiscussion): PromiseResponse<any> {
    return Service({
      method: 'patch',
      data,
      url: `${URL}/update`,
    })
  }

  /**
   * 根据班级id查询讨论
   * @returns
   */
  static async queryAll(
    params: QueryTopicInput
  ): PromiseResponse<QueryTopicResult> {
    return Service({
      method: 'get',
      url: `${URL}/queryTopic`,
      params,
    })
  }

  static queryIdeaForRate(params: QueryRateInput): PromiseResponse<{
    list: QueryIdeaResult[]
  }> {
    return Service({
      method: 'get',
      url: `${URL}/rate`,
      params,
    })
  }

  static updateRate(data: UpdateRateInput): PromiseResponse<any> {
    return Service({
      method: 'patch',
      data,
      url: `${URL}/rate`,
    })
  }
}
