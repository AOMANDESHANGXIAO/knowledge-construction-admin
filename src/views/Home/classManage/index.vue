<script setup lang="ts">
import { queryClassListApi, createClassApi } from '@/apis/class_'
import { useControl } from '@/hooks/useControl'

interface ClassListItem {
  class_id: number
  class_name: string
}

const classList = ref<ClassListItem[]>([])

const queryClassList = () => {
  queryClassListApi().then(res => {
    if (res.success) {
      const { data } = res
      classList.value = data.list
    }
  })
}
const queryParams = ref({
  class_id: '',
})
queryClassList()

const { control: visible, setControl: setVisible } = useControl()

const formModel = ref({
  class_name: '',
})

const { control: loading, setControl: setLoading } = useControl()

const handleCreateClass = () => {
  const params = {
    class_name: formModel.value.class_name,
  }
  setLoading(true)
  createClassApi(params)
    .then(res => {
      if (res.success) {
        ElNotification({
          title: '创建班级成功',
          message: '班级创建成功',
          type: 'success',
        })
        queryClassList()
        setVisible(false)
      } else {
        ElNotification({
          title: '创建班级失败',
          message: res.message,
          type: 'error',
        })
      }
    })
    .finally(() => {
      setLoading(false)
    })
}
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
        <el-button type="primary" @click="handleCreateClass" :loading="loading"
          >创 建</el-button
        >
      </el-form>
    </el-dialog>
    <div class="control-group">
      <el-select
        v-model="queryParams.class_id"
        placeholder="请选择查询班级"
        size="large"
        style="width: 200px"
      >
        <el-option
          v-for="item in classList"
          :key="item.class_id"
          :label="item.class_name"
          :value="item.class_id"
        ></el-option>
      </el-select>
      <el-button type="primary" size="large" plain>查 询</el-button>
      <el-button type="primary" size="large" @click="setVisible(true)"
        >创建班级</el-button
      >
    </div>
    <div class="st-table">
      <el-empty description="敬请期待"></el-empty>
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
