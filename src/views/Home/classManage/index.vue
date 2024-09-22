<script setup lang="ts">
import ClassAPI, {
  QueryAllResult,
  QueryStudentByClassIdResult,
} from '@/apis/class_'
import useRequest from '@/hooks/useRequest'
import useState from '@/hooks/useState'
import useTable from '@/hooks/useTable'
import columns from './column'
import myTable from '@/components/Table/index.vue'

/**
 * 查询班级列表逻辑
 */
const [classList, setClassList] = useState<QueryAllResult['list']>([])
const [visible, setVisible] = useState(false)
const [formModel] = useState({
  class_name: '',
})
useRequest<QueryAllResult>({
  apiFn: async () => {
    return ClassAPI.queryAll()
  },
  onSuccess(res) {
    setClassList(res.list)
  },
  onFailure() {
    ElNotification({
      title: '提示',
      message: '获取班级列表失败',
      type: 'error',
    })
  },
  immediate: true,
})
/**
 * 创建班级逻辑
 */
const { run: create, loading } = useRequest({
  apiFn: async () => {
    return ClassAPI.createClassApi(formModel.value.class_name)
  },
  onSuccess() {
    ElNotification({
      title: '提示',
      message: '创建班级成功',
      type: 'success',
    })
    getData()
  },
  onError() {
    ElNotification({
      title: '提示',
      message: '创建失败',
      type: 'error',
    })
  },
})
/**
 * 查询班级信息逻辑
 */
const queryParams = ref({
  id: 0,
})
watch(
  () => classList.value,
  () => {
    // 等待classList查询完毕
    queryParams.value.id = classList.value[0].id
    getData()
  }
)

const { data, currentPage, pageSize, totalNum, getData } = useTable<
  { id: number },
  QueryStudentByClassIdResult
>({
  url: '/classroom/user',
  queryParams: queryParams,
})
</script>

<template>
  <section class="st-layout-container">
    <el-dialog v-model="visible" width="500" title="创建班级">
      <el-form>
        <el-form-item label="班级名称">
          <el-input
            v-model="formModel.class_name"
            placeholder="请输入班级名称"
          ></el-input>
        </el-form-item>
        <el-button type="primary" plain @click="setVisible(false)"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="
            () => {
              create()
            }
          "
          :loading="loading"
          >创 建</el-button
        >
      </el-form>
    </el-dialog>
    <div class="control-group">
      <el-select
        v-model="queryParams.id"
        placeholder="请选择查询班级"
        size="large"
        style="width: 200px"
      >
        <el-option
          v-for="item in classList"
          :key="item.id"
          :label="item.class_name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        size="large"
        plain
        @click="
          () => {
            getData()
          }
        "
        >查 询</el-button
      >
      <el-button type="primary" size="large" @click="setVisible(true)"
        >创建班级</el-button
      >
    </div>
    <div class="st-table">
      <my-table
        :data="data"
        :columns="columns"
        v-model:page-size="pageSize"
        v-model:current-page="currentPage"
        v-model:total-num="totalNum"
      ></my-table>
    </div>
  </section>
</template>

<style scoped lang="scss">
.st-layout-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  width: 100%;
  padding: 10px;

  .control-group {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 60px;
    width: 100%;
    &:deep(.el-button) {
      margin: 0;
    }
  }
  .filter-container {
    width: 100%;
    height: 60px;
  }

  .st-table {
    width: 100%;
    flex: 1;
    // background-color: skyblue;
  }
}
</style>
