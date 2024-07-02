import { createApp } from 'vue'
import App from './App.vue'
import './styles/common.scss'
import store from './store'
import router from './router' // 导入 router
const app = createApp(App)

app.use(store)
app.use(router) // 使用 router
app.mount('#app')
