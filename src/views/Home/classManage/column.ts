import { QueryStudentByClassIdResult } from '@/apis/class_'
// 定义 el-table 的 column 列表
const columns: {
  prop: keyof QueryStudentByClassIdResult['list'][number]
  label: string
  width: string | number
}[] = [
  {
    prop: 'group_id',
    label: '组ID',
    width: 100,
  },
  {
    prop: 'id',
    label: '用户ID',
    width: 100,
  },
  {
    prop: 'nickname',
    label: '昵称',
    width: 150,
  },
  {
    prop: 'username',
    label: '用户名',
    width: 150,
  },
  {
    prop: 'group_name',
    label: '组名',
    width: 150,
  },
  {
    prop: 'group_description',
    label: '组描述',
    width: 200,
  },
  {
    prop: 'group_code',
    label: '组代码',
    width: 150,
  },
]

export default columns