<template>
  <div class="admin-manage-layout">
    <h1>管理员账号管理</h1>
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      style="max-width: 400px"
      class="form-layout"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addAdminAccount" :loading="loading"
          >添加管理员账号</el-button
        >
      </el-form-item>
    </el-form>
    <el-row style="width: 100%" class="refresh-control-box">
      <el-button @click="handleRefresh" :loading="listLoading" type="primary"
        >更 新</el-button
      >
    </el-row>
    <myTable
      :columns="columns"
      :current-page="currentPage"
      :page-size="pageSize"
      :data="data"
      :total-num="totalNum"
    ></myTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import useRequest from '@/hooks/useRequest'
import AuthAPI from '@/apis/login'
import myTable from '@/components/Table/index.vue'
import useTable from '@/hooks/useTable'

type AdminAccount = {
  username: string
  password: string
  nickname: string
}

export default defineComponent({
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElTable,
    ElTableColumn,
    myTable,
  },
  setup() {
    const columns = [
      {
        prop: 'username',
        label: '账号',
      },
      {
        prop: 'nickname',
        label: '昵称',
      },
      {
        prop: 'created_time',
        label: '创建时间',
      },
    ]
    const {
      data,
      pageSize,
      currentPage,
      totalNum,
      loading: listLoading,
      getData,
    } = useTable({
      url: '/auth/list',
      immdeiate: true,
    })
    const handleRefresh = () => {
      getData()
    }

    // 表单数据
    const formData = ref({
      username: '',
      password: '',
      nickname: '',
    })
    // 管理员账号列表
    const adminAccounts = ref<AdminAccount[]>([])
    // 表单引用
    const formRef = ref<InstanceType<typeof ElForm>>()

    const { run: register, loading } = useRequest({
      apiFn: async () => {
        return AuthAPI.register(formData.value)
      },
      onSuccess: () => {
        formData.value = {
          username: '',
          password: '',
          nickname: '',
        }
        handleRefresh()
        console.log('更新列表')
      },
      defaultNotify: true,
    })

    // 添加管理员账号的方法
    const addAdminAccount = () => {
      if (formRef.value?.validate()) {
        register()
      } else {
        ElNotification({
          title: '提示',
          type: 'info',
          message: '请填写管理员账号信息',
        })
      }
    }

    return {
      columns,
      formData,
      adminAccounts,
      formRef,
      addAdminAccount,
      loading,
      data,
      currentPage,
      pageSize,
      totalNum,
      handleRefresh,
      listLoading,
    }
  },
})
</script>

<style scoped lang="scss">
/* 可以在这里添加自定义样式 */
.admin-manage-layout {
  width: 100%;
  height: 100%;
  padding: 20px;
  h1 {
    font-size: 36px;
    font-weight: 400;
    margin-bottom: 10px;
  }
  .form-layout {
    margin-bottom: 20px;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 20px;
  }
  .refresh-control-box {
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin-bottom: 10px;
  }
}
</style>
