<script lang="ts" setup>
import { Lock, User } from '@element-plus/icons-vue'
import waveAnimation from '@/components/waveAnimation/index.vue'
import router from '@/router'
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { type FormInstance, type FormRules } from 'element-plus'
import AuthAPI, { LoginResult } from '@/apis/login'
import useRequest from '@/hooks/useRequest'
// const router = useRouter()

/** 登录表单元素的引用 */
const loginFormRef = ref<FormInstance | null>(null)

/** 验证码图片 URL */
/** 登录表单数据 */
const loginFormData = reactive({
  username: '',
  password: '',
})
/** 登录表单校验规则 */
const loginFormRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
  ],
}

/**
 * 登录逻辑函数
 */
const { loading, run } = useRequest<LoginResult>({
  apiFn: async () => {
    return AuthAPI.login(loginFormData)
  },
  onSuccess: res => {
    const { setUserStore } = useUserStore()
    setUserStore(res)
    router.push('/')
  },
  onFailure: () => {
    console.log('登录失败')
  },
  onError: () => {
    console.log('登录异常')
  },
})

const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      ElNotification({
        title: '表单校验失败',
        message: '请输入正确的用户名和密码',
        type: 'error',
      })
    }
    run()
  })
}
</script>

<template>
  <div class="st-login-container">
    <wave-animation
      style="position: fixed; bottom: 0"
      color="#4579e2"
    ></wave-animation>
    <div class="login-form-container">
      <img src="@/assets/login/logo-text-2.png" alt="" />
      <el-form
        :model="loginFormData"
        :rules="loginFormRules"
        style="width: 100%"
        hide-required-asterisk
        ref="loginFormRef"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="loginFormData.username"
            placeholder="输入账号"
            type="text"
            :prefix-icon="User"
            size="large"
            autofocus
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginFormData.password"
            placeholder="输入密码"
            type="password"
            :prefix-icon="Lock"
            size="large"
            @keyup.enter="handleLogin"
          ></el-input>
        </el-form-item>
        <el-button
          size="large"
          type="primary"
          style="width: 100%"
          :loading="loading"
          @click="handleLogin"
          >登 录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.st-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;

  .login-form-container {
    padding: 50px;
    box-sizing: content-box;
    width: 400px;
    border-radius: 10px;
    box-shadow: 0 0 0 1px #888888;
    background-color: #fff;
    z-index: 20;

    img {
      width: 100%;
      height: 175px;
      animation: img-move 1s ease-in-out infinite alternate;
    }
  }
}

@keyframes img-move {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(10px);
  }
}
</style>
