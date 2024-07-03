<script setup lang="ts">
import { useControl } from '@/hooks/useControl'
import { queryClassListApi } from '@/apis/class_'
import { createDiscussionApi } from '@/apis/discussion'
import { useUserStore } from '@/store/modules/user'

const { control: visible, setControl: setVisible } = useControl()

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

queryClassList()

const formModel = ref({
  topic_content: '',
  class_id: '',
})

const { control: loading, setControl: setLoading } = useControl()

const handleCreateTopic = () => {
  const params = {
    topic_content: formModel.value.topic_content,
    class_id: Number(formModel.value.class_id),
    created_user_id: Number(useUserStore().id),
  }
  setLoading(true)
  createDiscussionApi(params).then(res => {
    if (res.success) {
      setVisible(false)
      ElNotification({
        title: '创建讨论成功',
        message: '讨论创建成功',
        type: 'success',
      })
    } else {
      ElNotification({
        title: '创建讨论失败',
        message: res.message,
        type: 'error',
      })
    }
  }).finally(()=>{
    setLoading(false)
  })
}
</script>

<template>
  <section class="st-layout-container">
    <el-dialog v-model="visible" width="500" title="创建讨论">
      <el-form>
        <el-form-item label="发布班级">
          <el-select
            v-model="formModel.class_id"
            placeholder="请选择发布的班级"
            size="large"
          >
            <el-option
              v-for="item in classList"
              :key="item.class_id"
              :label="item.class_name"
              :value="item.class_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="讨论内容">
          <el-input
            v-model="formModel.topic_content"
            type="textarea"
            placeholder="请输入讨论内容"
          ></el-input>
        </el-form-item>
        <el-button type="primary" plain @click="setVisible(false)"
          >取 消</el-button
        >
        <el-button type="primary" @click="handleCreateTopic" :loading="loading"
          >创 建</el-button
        >
      </el-form>
    </el-dialog>
    <div class="control-group">
      <el-button type="primary" size="large" @click="setVisible(true)"
        >创建讨论</el-button
      >
    </div>
    <div class="st-table">
      <el-skeleton :rows="15" animated />
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
