<script lang="ts" setup>
import {type LoginFormParams} from './type.ts'
import {Lock, User} from '@element-plus/icons-vue'
import {type FormRules, type FormInstance} from "element-plus";
import waveAnimation from '@/components/waveAnimation/index.vue'
import {loginApi} from '@/apis/login/index.ts'
import {useUserStore} from '@/store/modules/user.ts'
import router from '@/router'

defineOptions({
  name: 'loginIndex',
})

const loginFormRef = ref<FormInstance | null>(null)

const loginForm = ref<LoginFormParams>({
  username: 'root',
  password: 'stream',
})

const loginFormRules: FormRules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
  ]
}

const userStore = useUserStore()

const setUserInfo = (params: { username: string, access_token: string, id: number|string}) => {
  userStore.setUserInfo(params)
}

const adminLogin = async () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params = {
        username: loginForm.value.username,
        password: loginForm.value.password
      }
      loginApi(params).then(res => {
        const response: any = res
        if(response.success) {
          const data: any = res.data
          const params = {
            username: data.nickname,
            access_token: data.token,
            id: data.id,
          }
          setUserInfo(params)
          console.log(params)
          ElNotification({
            title: '登录成功',
            message: '欢迎回来',
            type: 'success'
          })
          router.push('/')
          // window.location.reload()
        }
      })
    }
  })

}
</script>

<template>
  <div class="st-login-container">
    <wave-animation style="position: fixed; bottom: 0" color="#4579e2"></wave-animation>
    <div class="login-form-container">
      <img src="@/assets/login/logo-text-2.png" alt="">
      <el-form :model="loginForm" :rules="loginFormRules" style="width: 100%" hide-required-asterisk ref="loginFormRef">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" placeholder="输入账号" type="text" :prefix-icon="User" size="large"
                    autofocus></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" placeholder="输入密码" type="password" :prefix-icon="Lock"
                    size="large" @keyup.enter="adminLogin"></el-input>
        </el-form-item>
        <el-button size="large" type="primary" style="width: 100%;" @click="adminLogin">登 录</el-button>
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
