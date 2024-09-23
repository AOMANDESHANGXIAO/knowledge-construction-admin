import Service, { PromiseResponse } from '@/apis'
import { NodeType, EdgeType } from '@/views/Home/processManage/utils/convert'

type QueryNodeContentResult = {
  nodes: NodeType[]
  edges: EdgeType[]
}

export type { QueryNodeContentResult }

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
}
