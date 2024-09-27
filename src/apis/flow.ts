import Service, { PromiseResponse } from '@/apis'
import { NodeType, EdgeType } from '@/views/Home/processManage/utils/convert'

type QueryNodeContentResult = {
  nodes: NodeType[]
  edges: EdgeType[]
}
type QueryWordCloudResult = {
  list: {
    group_name: string
    text: string
  }[]
}
export type { QueryNodeContentResult, QueryWordCloudResult }

const URL = '/flow'

export default class FlowAPI {
  static async queryContentByNodeID(params: {
    node_id: number
  }): PromiseResponse<QueryNodeContentResult> {
    return Service({
      method: 'get',
      url: `${URL}/query_content`,
      params,
    })
  }
  static queryWordCloud(params: {
    topic_id: number
  }): PromiseResponse<QueryWordCloudResult> {
    return Service({
      method: 'get',
      params,
      url: `${URL}/wordCloud`,
    })
  }
}
