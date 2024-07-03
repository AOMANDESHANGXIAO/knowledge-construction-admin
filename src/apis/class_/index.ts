import Service from '@/apis/index'
import type { CreateClassParams } from '@/apis/class_/type.ts'

const queryClassListApi = () => {
  return Service.get('/class/list')
}

const createClassApi = (params: CreateClassParams) => {
  return Service.post('/class/create', params)
}

export { queryClassListApi, createClassApi }
