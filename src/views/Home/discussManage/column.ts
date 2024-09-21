interface Topic {
  id: number
  publisher: string
  topic_content: string
  created_time: string
  created_user_id: number
  topic_for_class_id: number
  status: string
  class_name: string
}
export type { Topic }
// 定义 el-table 的 column 列表
const columns: { prop: keyof Topic; label: string; width?: string | number }[] =
  [
    {
      prop: 'id',
      label: 'ID',
      width: 80,
    },
    {
      prop: 'publisher',
      label: '发布者',
      width: 120,
    },
    {
      prop: 'topic_content',
      label: '主题内容',
      width: 300,
    },
    {
      prop: 'created_time',
      label: '创建时间',
      width: 200,
    },
    {
      prop: 'created_user_id',
      label: '创建用户ID',
      width: 120,
    },
    {
      prop: 'topic_for_class_id',
      label: '班级ID',
      width: 120,
    },
    {
      prop: 'status',
      label: '状态',
      width: 120,
    },
    {
      prop: 'class_name',
      label: '班级名称',
      width: 150,
    },
  ]

export default columns
