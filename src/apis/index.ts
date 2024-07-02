// src/http/axios.js
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

axios.defaults.timeout = 10000 // 请求超时时间

const Service = axios.create({
  baseURL: '/',
})

// axios 请求拦截器
Service.interceptors.request.use(
  config => {
    if (localStorage.getItem('access_token')) {
      config.headers.Authorization = localStorage.getItem('access_token')
    }
    return config
  },
  error => {
    ElMessage({
      message: '请求超时!请检查网络',
      type: 'error',
    })
    return Promise.reject(error)
  }
)
// axios respone拦截器
Service.interceptors.response.use(
  res => {
    if (res.status == 200) {
      return res
    } else if (res.status == 401) {
      router.push('/home')
      return res
    } else if (res.status == 201) {
      return res
    }
    return res
  },
  error => {
    ElMessage({
      type: 'error',
      message: `请求出错。错误代码:${error.response.status}`,
    })
    return Promise.reject(error.response.data)
  }
)

export default Service
