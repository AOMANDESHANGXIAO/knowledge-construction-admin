import Service from '@/apis/index'
import { CreateDiscussionParams } from './type'

const createDiscussionApi = (params: CreateDiscussionParams) => {
  return Service.post('/discuss/create', params)
}

export {
  createDiscussionApi
}
