import { createApp } from 'vue'
import App from './App.vue'

import router from './router' // 导入 router
import './styles/common.scss'
import store from './store'

const app = createApp(App)

app.use(store)
app.use(router) // 使用 router
app.mount('#app')
