<script setup lang="ts">
import ClassAPI, {
  QueryAllResult,
  QueryStudentByClassIdResult,
} from '@/apis/class_'
import useRequest from '@/hooks/useRequest'
import useState from '@/hooks/useState'
/**
 * 查询班级列表逻辑
 */
const [classList, setClassList] = useState<QueryAllResult['list']>([])
const [visible, setVisible] = useState(false)
const [formModel] = useState({
  class_id: undefined,
  topic_content: '',
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
              :key="item.id"
              :label="item.class_name"
              :value="item.id"
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
        <el-button
          type="primary"
          plain
          @click="
            () => {
              setVisible(false)
            }
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="">创 建</el-button>
      </el-form>
    </el-dialog>
    <div class="control-group">
      <el-button type="primary" size="large" @click="setVisible(true)"
        >创建讨论</el-button
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
